# Monster-Companion-System

## 1. 概要
オトモモンスター（同行モンスター）システムは、探索者が拠点（ギルド・倉庫）で所有しているモンスターを「同行枠（Companion Slot）」に編成し、ランダムダンジョン（フロンティア）や他管理者のダンジョン探索に連れて伴走・共闘させる仕組みです。
同行モンスターは探索者の後方や周辺を追従し、設定された AI 作戦指示（戦術）に従って自動的に戦闘、援護、回復、またはアイテム拾得を行います。

## 2. 同行編成と出撃ルール

### 2.1 編成条件
- プレイヤーは拠点のギルドまたは [倉庫システム](Warehouse-System.md) 画面において、所持しているモンスターから最大 **1 体** を「同行モンスター（Companion）」として設定できます。
- **成長制限**: 幼体（Level 1〜4）および成体（Level 5〜99）のいずれも同行可能です。ただし幼体はステータス補正（0.7倍）が適用され、特殊スキルを使用できません（詳細は [モンスターシステム](Monster-System.md#4-2-1-モンスターの成長段階-growth-stages) 参照）。
- **活力制限**: 出撃時に対象モンスターの活力（`vigor`）が **10 以上** 残存している必要があります。活力が 10 未満の個体は同行出撃させることができません。

### 2.2 出撃時のリソース消費
- ダンジョンに進入した時点で、同行モンスターの活力 (`vigor`) が **10 消費** されます。
- ダンジョン探索中、同行モンスターは **60 ティックごとに 満腹度 (Satiety) を 1 ポイント自動消費** します。

## 3. AI 戦術指示（Tactics）

探索者はコマンド操作または UI 上の「戦術パレット（Tactic Wheel）」から、リアルタイムに同行モンスターの AI ルーチンを切り替えることができます。

| 戦術 ID | 名称 | 特徴・優先行動ルーチン | 行動消費スタミナ |
| :--- | :--- | :--- | :---: |
| `aggressive` | **積極攻撃** | 視界内の敵（モンスター・他プレイヤー）に積極的に接近し、近接・遠距離攻撃および攻撃スキルを優先実行する。 | 5 ST / 行動 |
| `defensive` | **防御・護衛** | 探索者の隣接マス（1〜2マス以内）を維持し、探索者を攻撃しようとする敵へ反撃・割り込み防御を行う。 | 3 ST / 行動 |
| `support` | **支援・回復** | 攻撃を最小限に抑え、探索者や自身の HP 低下時に回復スキルやバフスキルを最優先で使用する。 | 2 ST / 行動 |
| `follow` | **追従・非戦闘** | 一切の攻撃を行わず、探索者の移動後を忠実に追従する。敵との交戦を避けスタミナ消費を抑える。 | 1 ST / 行動 |

## 4. 活力・満腹度および給餌（Feeding）メカニズム

### 4.1 満腹度と餓鬼状態
- 同行モンスターの満腹度が **0** になると「空腹状態」に陥り、10 ティックごとに最大 HP の **2% のスリップダメージ** を受けます。
- 満腹度が 0 の状態では、戦術コマンドの実行や攻撃スキルの発動が不能となります。

### 4.2 給餌（Feed）アクション
- 探索者はインベントリ内の食料（`food`）または肉・魚・熟成肉アイテムを選択し、同行モンスターに「給餌（`feed`）」することができます。
- 給餌により同行モンスターの満腹度および活力（`vigor`）が回復します。
- **給餌アクションのコスト**: 行動基本インターバル **10 ティック**、探索者スタミナ消費 **5 ST**。

### 4.3 ダウン状態（Downed）と強制回収
- 同行モンスターの HP が 0 に達すると「ダウン状態 (`isDowned: true`)」となります。
- ダウン状態ではその場に倒れ込み、一切の行動が不可となります。
- **救助・手当**: 探索者がダウンした同行モンスターの隣接マスで手当アクションを行うか、蘇生アイテムを使用することで HP 1 で復帰させることができます。
- **強制送還**: ダウン状態のまま探索者が別フロアへ移動するか、ダンジョンを脱出・死亡した場合、同行モンスターは自動的に拠点倉庫へ送還され、**活力 (vigor) が 0** となります。

## 5. REST API 仕様

同行モンスターの編成、戦術変更、給餌、および送還を行うための REST API 仕様です。

### 5.1 同行モンスター出撃登録 (Deploy Companion)
- **エンドポイント**: `POST /api/player/{userId}/companion/deploy`
- **リクエスト**: `CompanionDeployRequest` (`monsterId: string`)
- **レスポンス**: `CompanionDeployResult`
  - 成功時: `success: true`, `companion: CompanionState`

### 5.2 同行モンスター送還・解除 (Dismiss Companion)
- **エンドポイント**: `DELETE /api/player/{userId}/companion/dismiss`
- **レスポンス**: `CompanionDismissResult`
  - 成功時: `success: true`, `dismissedMonsterId: string`

### 5.3 戦術指示変更 (Update Companion Tactic)
- **エンドポイント**: `PUT /api/player/{userId}/companion/tactic`
- **リクエスト**: `CompanionTacticUpdateRequest` (`tactic: 'aggressive' | 'defensive' | 'support' | 'follow'`)
- **レスポンス**: `CompanionTacticUpdateResult`
  - 成功時: `success: true`, `currentTactic: string`

### 5.4 同行モンスター給餌 (Feed Companion)
- **エンドポイント**: `POST /api/player/{userId}/companion/feed`
- **リクエスト**: `CompanionFeedRequest` (`itemId: string`)
- **レスポンス**: `CompanionFeedResult`
  - 成功時: `success: true`, `recoveredSatiety: number`, `recoveredVigor: number`, `remainingFoodCount: number`

## 6. データ構造 (`CompanionState`)

同行モンスターの現在状態は `CompanionState` インターフェースで保持され、`Player` データモデルに包含されます（[実装詳細](../implementation/Implementation-Details.md) 参照）。

```typescript
export interface CompanionState {
  monsterId: string;
  monsterTypeId: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  satiety: number;
  maxSatiety: number;
  vigor: number;
  tactic: 'aggressive' | 'defensive' | 'support' | 'follow';
  isDowned: boolean;
  position: { x: number; y: number };
}
```

## 7. 相互参照
- [ゲーム機能概要](Game-Features.md)
- [アクションシステム](Action-System.md)
- [モンスターシステム](Monster-System.md)
- [満腹度システム](Hunger-System.md)
- [活力システム](Vigor-System.md)
- [倉庫システム](Warehouse-System.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [UI・UX設計](UI-UX-Design.md)
