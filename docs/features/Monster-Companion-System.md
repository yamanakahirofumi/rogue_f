# 仲間モンスター帯同システム (Monster Companion System)

## 1. 概要
仲間モンスター帯同システム（Monster Companion System）は、探索者（プレイヤー）が拠点倉庫で飼育・所有しているモンスター、またはギルドで一時雇用したモンスターを 1 体選び、「仲間（Companion）」としてダンジョン探索に連れて行く（帯同させる）仕組みです。

これまでモンスターはダンジョン管理者による配置、遠征隊への派遣、あるいは PKer による憑依操作が中心でしたが、本システムの導入により、探索者も自身の育成したモンスターと共にリアルタイム制ダンジョン攻略に挑むことが可能となります。

帯同モンスターはプレイヤーの後方に追従し、設定された AI 戦術パターンに従って索敵・攻撃・味方の回復やサポートを行います。

---

## 2. 出撃準備と帯同ルール

### 2.1 帯同編成と出撃条件
- **帯同上限**: 探索者がダンジョンへ出撃する際、同時に帯同できるモンスターは **最大 1 体** です。
- **編成場所**: 出撃前に**拠点の倉庫（Warehouse）**または**ギルド（Guild）**の仲間管理画面にて帯同モンスターを選択します。
- **出撃条件**:
  - 対象モンスターのステータスが「待機 (`idle`)」であること（遠征中やダンジョン配置中の個体は不可）。
  - モンスターの活力（Vigor）が **20 以上** 残存していること。
  - モンスターが死亡（HP 0）状態でないこと。

### 2.2 出撃時のデータ状態
帯同モンスターが決定すると、該当個体の状態は「帯同中 (`companion`)」へと一時変更され、探索者の `activeCompanion` パラメーターに同期されます。

---

## 3. ダンジョン内挙動とAI戦術

### 3.1 探索者との位置関係およびミニマップ表示
- **基本位置**: ダンジョン内において、帯同モンスターは常に探索者の 1〜2 マス後方（または隣接マス）に位置取りを行います。
- **障害物とスタック回避**: 扉の通過や狭い通路で探索者と位置が重なる、または離れすぎた（距離 8 マス以上）場合、自動的に探索者の隣接空きマスへワープ（再追従）します。
- **ミニマップ表示**: ミニマップ上では、緑色の英字記号 `M`（Companion Monster）として識別表示されます。

### 3.2 AI戦術パターン (Companion Tactics)
探索者はダンジョン探索中、コマンド（またはパレット操作）により帯同モンスターの AI 戦術をリアルタイムで切り替えることができます。

| 戦術コード | 戦術名 | 優先行動ロジック | ターゲット選択方針 |
| :--- | :--- | :--- | :--- |
| `aggressive` | **攻撃重視** | 視界内の敵（野生モンスター・他派閥PKer）に接近し、攻撃およびダメージスキルを優先発動。 | 最も距離が近い敵、または探索者が攻撃中の敵。 |
| `defensive` | **防衛重視** | 探索者の周囲 1 マスを維持し、探索者を攻撃する敵を最優先で反撃・迎撃。 | 探索者にダメージを与えた敵（ヘイト最優先）。 |
| `support` | **サポート重視** | 探索者や自身の HP が低下した際、回復・バフスキル（`heal`, `buff` 等）を最優先発動。間合いを取る。 | HP残量が最も少ない味方（探索者優先）。 |
| `follow` | **追従優先** | 敵への攻撃を行わず、探索者の移動に完全に追従する。罠回避を最優先。 | 戦闘行動を行わない。 |

### 3.3 スキル発動指示
通常は AI が自動でクールタイム管理を行いスキルを実行しますが、探索者は基本アクションコマンドとして特定スキルの即時発動指示を出すことができます（クールタイム中を除く）。

---

## 4. リソース管理と成長・回復

### 4.1 活力 (Vigor) および満腹度の消費
- **時間経過消費**: 帯同モンスターはダンジョン内で **50 ティック通過ごとに 活力 (Vigor) を 1 消費** します。
- **戦闘消費**: 特殊行動（スキル）の発動ごとに、各スキルの定義に応じた活力を追加消費します。
- **活力枯渇ペナルティ**: 活力が 0 になった場合、帯同モンスターは「疲弊」状態となり、移動速度・攻撃速度が 50% 低下し、スキル発動不可となります。

### 4.2 エサ（食料）の投与と回復
探索者はインベントリ内の食料アイテム（肉、魚、木の実等）を帯同モンスターに投与（`feed`）することで、活力および HP・満腹度を回復させることができます。
- モンスターの好物属性に適合する食料アイテムを投与した場合、活力回復量に **1.5 倍** のボーナスが付与されます。

### 4.3 経験値（EXP）獲得とレベルアップ
- 帯同モンスターは、ダンジョン内で探索者が撃破したモンスター、および自身が撃破・アシストしたモンスターから **獲得経験値の 50% を獲得** します。
- 経験値が一定値に達すると即時にレベルアップし、最大 HP・攻撃力・防御力等のステータスが成長します。獲得データは拠点帰還時に永続保存されます。

---

## 5. ダウン・撤退・死亡メカニズム

### 5.1 ダウン（Downed）状態
帯同モンスターの HP が 0 に達した際、即座に消失・死亡するのではなく、まず **「ダウン (`downed`)」** 状態となります。
- **ダウン中の挙動**: 移動・攻撃が不能となり、その場に倒れ込みます。100 ティックの「蘇生猶予カウント」が開始されます。
- **気絶回復アイテム**: 探索者が「蘇生薬」や「祝福されたポーション」をダウン中のモンスターに使用した場合、HP 30% の状態で即時復帰します。
- **カウント超過**: 蘇生されずに 100 ティックが経過した場合、帯同モンスターは緊急撤退（モンスターボールへ回収）され、そのダンジョン内では再召喚不可となります。

### 5.2 プレイヤー死亡時の挙動
探索者（プレイヤー）がダンジョン内で死亡した場合、帯同モンスターは自動的に緊急回収され拠点倉庫へと帰還します。
- 探索者のデスペナルティ設定に関わらず、帯同モンスター自体が没収・消失することはありませんが、活力は 0 となります。

---

## 6. REST API 仕様

### 6.1 帯同モンスター出撃登録 API
- **エンドポイント**: `POST /api/player/{userId}/companion/deploy`
- **概要**: 拠点倉庫のモンスターを帯同対象としてセットします。
- **リクエストボディ**: `CompanionDeployRequest`
- **レスポンス**: `CompanionDeployResult`

### 6.2 帯同モンスター解除・送還 API
- **エンドポイント**: `DELETE /api/player/{userId}/companion/dismiss`
- **概要**: 現在帯同中のモンスターを解除し、倉庫へ返還します。
- **レスポンス**: `CompanionDismissResult`

### 6.3 AI戦術変更 API
- **エンドポイント**: `PUT /api/player/{userId}/companion/tactic`
- **概要**: 帯同モンスターの AI 戦術パターンを変更します。
- **リクエストボディ**: `CompanionTacticUpdateRequest`
- **レスポンス**: `CompanionTacticUpdateResult`

### 6.4 エサ（食料）投与 API
- **エンドポイント**: `POST /api/player/{userId}/companion/feed`
- **概要**: インベントリ内のアイテムを帯同モンスターに与えて活力・HPを回復させます。
- **リクエストボディ**: `CompanionFeedRequest`
- **レスポンス**: `CompanionFeedResult`

---

## 7. データ構造と TypeScript 型定義

```typescript
export type CompanionTactic = 'aggressive' | 'defensive' | 'support' | 'follow';
export type CompanionStatus = 'active' | 'exhausted' | 'downed' | 'dismissed';

export interface CompanionState {
  instanceId: string;           // モンスター個体固有ID
  monsterTypeId: string;        // モンスター種別ID (例: 'slime', 'goblin_warrior')
  name: string;                 // モンスター名・愛称
  level: number;                // 現在のレベル
  exp: number;                  // 累積経験値
  nextExp: number;              // 次のレベルまでの必要経験値
  hp: number;                   // 現在のHP
  maxHp: number;                // 最大HP
  vigor: number;                // 現在の活力 (0〜100)
  maxVigor: number;             // 最大活力 (100)
  attribute: string;            // 属性
  tactic: CompanionTactic;      // 現在設定されているAI戦術
  status: CompanionStatus;      // 現在の状態
  position?: { x: number; y: number }; // マップ上の現在座標
  downedTicksRemaining?: number; // ダウン時の残り蘇生猶予ティック
}

export interface CompanionDeployRequest {
  monsterInstanceId: string;    // 帯同させる倉庫内モンスターの個体ID
  initialTactic?: CompanionTactic; // 初期AI戦術 (デフォルト: 'aggressive')
}

export interface CompanionDeployResult {
  success: boolean;
  companion?: CompanionState;
  message: string;
}

export interface CompanionDismissResult {
  success: boolean;
  returnedToWarehouse: boolean;
  message: string;
}

export interface CompanionTacticUpdateRequest {
  tactic: CompanionTactic;
}

export interface CompanionTacticUpdateResult {
  success: boolean;
  updatedTactic: CompanionTactic;
  message: string;
}

export interface CompanionFeedRequest {
  itemId: string;               // 投与するインベントリ内食料アイテムの個体ID
}

export interface CompanionFeedResult {
  success: boolean;
  recoveredVigor: number;
  recoveredHp: number;
  consumedItemId: string;
  isFavoriteFoodBonus: boolean; // 好物ボーナスが適用されたか
  message: string;
}
```

---

## 8. UI/UX 設計要件

### 8.1 帯同モンスター HUD ウィジェット
画面左上（プレイヤーサブステータス表示部）に、帯同モンスター専用の小型 HUD ウィジェットが常時表示されます。
- **表示内容**: モンスターアイコン・名前、Lv、HPゲージ（数値併記）、活力（Vigor）ゲージ、現在戦術アイコン（`AGGR`, `DEF`, `SUPP`, `FOL`）。
- **ステータス警告**: 活力が 20 未満またはダウン状態になった場合、ゲージの色変化および警告アイコンが表示されます。

### 8.2 簡易コマンドパレット
ホットキー（デフォルト: `C` キー）またはタップ操作により、帯同モンスターへの戦術切り替えおよびスキル指示ダイアログが開きます。

---

## 9. イベントログ仕様

ダンジョン内で発生した帯同モンスター関連のアクションは、`companion_event` として記録されます。

```typescript
export interface CompanionEventDetails {
  action: 'deploy' | 'tactic_change' | 'feed' | 'skill_use' | 'downed' | 'revived' | 'dismissed';
  companionInstanceId: string;
  monsterTypeId: string;
  currentHp: number;
  currentVigor: number;
  tactic?: CompanionTactic;
  usedItemId?: string;
  message: string;
}
```
