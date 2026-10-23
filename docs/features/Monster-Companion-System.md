# 仲間モンスターシステム

## 1. 概要
仲間モンスターシステムは、探索者（プレイヤー）が拠点や倉庫に登録・育成したモンスターを「同行仲間（コンパニオン）」としてダンジョン探索に連れ出し、共に戦い成長する仕組みです。
プレイヤー単独での探索に加え、モンスターの固有スキルや属性、攻撃・サポートAIを組み合わせることで、戦局の不確実性に対する戦略性と没入感を深めます。

## 2. 同行編成・出撃条件

### 2.1 同行枠と出撃制限
- **最大同時出撃数**: プレイヤー1名につき最大 **1体** の仲間モンスターをダンジョンに連れて行くことができます。
- **編成場所**: 拠点（ギルド・倉庫）またはダンジョン突入前の出撃準備画面にて、倉庫に保管中のモンスターから同行仲間を選択します。
- **出撃可能な状態**:
  - ステータスが `idle`（待機中）であり、HPおよび活力（Vigor）が **1以上** 存在するモンスターのみ選択可能です。
  - 遠征中（`expedition`）や負傷中（`injured`）のモンスターは出撃できません。

### 2.2 出撃時のデータ転送と追従
- ダンジョン突入時、仲間モンスターの基本ステータスおよび現在のHP・活力・満腹度が探索用コンパニオン状態（`CompanionState`）として初期化され、プレイヤーの隣接マスに配置されます。
- ダンジョンの階層移動（階段昇降、転送ゲート等）の際、 companion は自動的にプレイヤーの周囲 1 マス（空き床タイル）に再配置されます。

## 3. 作戦（AI思考モード）と行動制御

### 3.1 4つの作戦モード
プレイヤーは探索中、いつでも companion に対してリアルタイムで作戦（`tactic`）を変更できます。作戦変更のアクションコストは **0（即時実行）** です。

| 作戦モード | 識別子 | AI行動ロジック |
| :--- | :--- | :--- |
| **ガンガンいこうぜ** | `aggressive` | 視界内の敵（野生モンスター・PKer）を最優先でターゲットし、移動および近接/遠距離攻撃、攻撃スキルを積極的に使用します。 |
| **いのちをだいじに** | `defensive` | プレイヤーの周囲 2 マス以内を維持し、隣接する敵に対してのみ攻撃します。残りHPが30%以下になるとプレイヤーの背後に後退します。 |
| **サポート** | `support` | 回復スキルやバフ/デバフスキルを優先使用します。攻撃はプレイヤーが攻撃している対象に限定し、後方から支援します。 |
| **ついてきて** | `follow` | 敵への攻撃を一切行わず、プレイヤーの移動に追従します。トラップ回避や一時避難、誘導時に使用します。 |

### 3.2 固有スキルの実行
- モンスターマスターリスト（[Monster-Master-List.md](Monster-Master-List.md)）で定義された各モンスターの特殊スキル（クールタイム `cooldownTicks` 管理）は、作戦モードおよび対象範囲に応じて自動発動されます。

## 4. 満腹度・活力管理とエサやり

### 4.1 満腹度（Satiety）と活力（Vigor）の消費
- 同行中、companion は **10 ティックごとに 満腹度 (Satiety) を 1 消費** します。
- 満腹度が **0** になると「飢餓状態」となり、10 ティックごとに **最大HPの 5% のダメージ** を受け、自然回復が停止します。
- companion の活力（Vigor）は戦闘行動（攻撃・スキル使用）ごとに 1 消費され、活力が **0** になると全ステータス（ATK/DEF/SPD）が **20% 低下** します。

### 4.2 エサやり（Feeding）メカニズム
- プレイヤーはインベントリ内の食料アイテム（肉類、果実、魚、調理料理等）を companion に与える「エサやり (`feed`)」アクションを実行できます。
- エサやり効果:
  - 対象食料の満腹度回復量が companion の `satiety` に加算されます（最大値 100）。
  - 食料の回復効能に応じた HP および活力（Vigor）の回復が同時に行われます。
  - 祝福された食料を与えた場合、満腹度と HP/活力回復量が 1.5 倍になり、一時的に親愛度バフが付与されます。

## 5. 戦闘・経験値分配と倒れた時の挙動

### 5.1 経験値の分配
- ダンジョン内で敵モンスターを撃破した際、プレイヤーが獲得する標準経験値の **50%** が同行仲間モンスターにも「共用経験値」として配分されます。
- companion がレベルアップした場合、基礎ステータスが上昇し、即座に HP が全回復します。

### 5.2 戦闘不能（Downed）と救護・死亡処理
- companion の HP が **0** に達した場合、即座に消滅・死亡せず **気絶状態 (`DOWNED`)** に移行し、その場に倒れ込みます（20 ティック維持）。
- **救護（Revive）**:
  - 気絶中（20 ティック以内）にプレイヤーが救護アイテム（「フェニックスの羽」や回復薬）を対象マスで使用すると、HP 30% で復帰します。
- **時間切れ・離脱**:
  - 20 ティック以内に救護されない場合、または救護前に階層移動を行った場合、companion はダンジョンから緊急離脱し、倉庫へ返還されます。
  - 返還時、モンスターのステータスは `injured`（負傷中）に更新され、拠点での手動治療または宿屋全回復を行うまで再出撃不能となります。

## 6. REST API 仕様

### 6.1 同行出撃リクエスト
- **エンドポイント**: `POST /api/player/{userId}/companion/deploy`
- **リクエストボディ (`CompanionDeployRequest`)**:
  - `monsterId`: 倉庫に存在する対象モンスターのユニークID
- **レスポンス (`CompanionDeployResult`)**:
  - `success`: 成否フラグ
  - `companion`: 初期化された `CompanionState` オブジェクト

### 6.2 同行解除（離脱）リクエスト
- **エンドポイント**: `DELETE /api/player/{userId}/companion/dismiss`
- **レスポンス (`CompanionDismissResult`)**:
  - `success`: 成否フラグ
  - `returnedToWarehouse`: 倉庫への返還確認フラグ

### 6.3 作戦変更リクエスト
- **エンドポイント**: `PUT /api/player/{userId}/companion/tactic`
- **リクエストボディ (`CompanionTacticUpdateRequest`)**:
  - `tactic`: `'aggressive' | 'defensive' | 'support' | 'follow'`
- **レスポンス (`CompanionTacticUpdateResult`)**:
  - `success`: 成否フラグ
  - `currentTactic`: 更新後の作戦名

### 6.4 エサやりリクエスト
- **エンドポイント**: `POST /api/player/{userId}/companion/feed`
- **リクエストボディ (`CompanionFeedRequest`)**:
  - `itemId`: インベントリ内の食料アイテムID
- **レスポンス (`CompanionFeedResult`)**:
  - `success`: 成否フラグ
  - `restoredSatiety`: 回復した満腹度
  - `restoredHp`: 回復したHP
  - `restoredVigor`: 回復した活力

## 7. データモデル

`CompanionState` 型定義は `src/@types/player.d.ts` にて提供されます。

```typescript
export interface CompanionState {
  monsterId: string;
  name: string;
  species: string;
  level: number;
  hp: number;
  maxHp: number;
  vigor: number;
  maxVigor: number;
  satiety: number;
  maxSatiety: number;
  tactic: 'aggressive' | 'defensive' | 'support' | 'follow';
  status: 'active' | 'downed' | 'injured';
  downedTicksRemaining?: number;
}
```

## 8. 相互参照
- [モンスターシステム](Monster-System.md)
- [モンスター繁殖システム](Monster-Breeding-System.md)
- [活力システム](Vigor-System.md)
- [満腹度システム](Hunger-System.md)
- [アクションシステム](Action-System.md)
- [拠点システム](Base-System.md)
- [UI・UX設計](UI-UX-Design.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [Player型定義](../../src/@types/player.d.ts)
