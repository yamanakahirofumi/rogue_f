# モンスター同行システム (Monster Companion System)

## 1. 概要
モンスター同行（Companion）システムは、探索者（Player）が拠点（ギルド・[倉庫システム](Warehouse-System.md)）で所持・繁殖・育成したモンスターから 1 体をパートナー（同行者）として指名し、ランダムダンジョン（フロンティア）の探索に帯同させる仕組みです。
同行モンスターは自律的な AI 判断で探索者に追従・戦闘補助を行い、リアルタイムでの「作戦切り替え」や「エサやり」を通じて、探索のリターン拡大と生存率向上に寄与します。

## 2. 帯同（デプロイ）および管理ルール

### 2.1 同行条件と制約
- **帯同上限**: 探索者 1 名につき、同時に同行できるモンスターは **1 体** までです。
- **デプロイ場所**: 拠点（Base）の倉庫またはギルドNPC窓口でのみデプロイ・解除が行えます。ダンジョン内での新規召喚・変更はできません。
- **条件要件**:
  - 対象モンスターの成長段階が **「成体 (`adult`)」**（レベル 5 以上）であること（[モンスターシステム](Monster-System.md) 参照）。
  - 対象モンスターの現在活力（`vigor`）が **30 以上** 存在すること。
- **活力消費**: ダンジョンへの入場・デプロイ時に、対象モンスターの活力を **30 消費** します。

### 2.2 モンスターのステータスと同行状態
- 同行中のモンスターは専用のデータ構造 `CompanionState` で管理されます。
- **ステータス連動**: 基礎ステータス（HP、スタミナ、攻撃力、防御力、敏捷性、運等）および継承特性（`traits`）は倉庫内の個体データ（`StoredMonster`）から引き継がれます。
- **同行中の状態 (`status`)**: 倉庫内における対象個体のステータスは `'expedition'` や `'placed'` と区別され、`'idle'` から **同行中** へと更新されます。

## 3. 戦闘 AI と作戦指示 (Combat AI & Tactics)

同行モンスターはプレイヤーの移動・行動に同期して自律的に思考・行動します。プレイヤーはリアルタイムに「作戦 (Tactic)」を変更し、モンスターの優先AIパターンを切り替えることができます。

### 3.1 作戦モード (Tactics)

| 作戦名 (Tactic) | 表示名 | 優先行動パターン | 特徴・使いどころ |
| :--- | :--- | :--- | :--- |
| **`aggressive`** | ガンガンいこう | 視界内の最も近い敵へ接近・攻撃（スキルを優先発動）。 | 雑魚敵の殲滅、高速な階層走破時。 |
| **`defensive`** | いのちだいじに | プレイヤーの周囲 2 マス以内を維持し、プレイヤーを狙う敵を優先迎撃。 | 狭い部屋での交戦、プレイヤーのHP低下時。 |
| **`support`** | サポート | 回復・バフスキルや状態異常付与スキルを最優先実行。 | ボス戦や強敵遭遇時、持続戦闘時。 |
| **`follow`** | ついてきて | 戦闘を回避し、プレイヤーの直後を最優先追従。 | トラップ地帯の通過、階段へ直行する場合。 |

### 3.2 作戦切り替えメカニズム
- **操作UI**: クライアント HUD（[UI・UX設計](UI-UX-Design.md) 参照）の専用作戦バッジからワンタップ/ショートカットキーで瞬時に切り替え可能。
- **API 通信**: `PUT /api/player/{userId}/companion/tactic` を送信し、サーバー側で即座に AI 思考モードを更新します。

## 4. 満腹度・活力およびエサやり (Satiety, Vigor & Feeding)

### 4.1 満腹度・活力消費
- **満腹度の減少**: 同行モンスターはプレイヤーと同様に行動（移動・攻撃・スキル発動）ごとに満腹度（`satiety` / 最大 100）を消費します（[満腹度システム](Hunger-System.md) 参照）。
- **飢餓状態**: 満腹度が 0 に達すると飢餓状態となり、10 ティックごとに **最大 HP の 5%** のダメージを受けます。

### 4.2 エサやり (Feeding)
- **概要**: プレイヤーはインベントリ内の食料・肉類アイテム（例: `meat_dried`, `cooked_cave_salmon`, `food_ration` 等）を同行モンスターに与えることができます。
- **効果**:
  - 食料アイテムに応じた **満腹度回復**。
  - モンスターの **HP 回復**（回復効果のある食料の場合）。
- **REST API**: `POST /api/player/{userId}/companion/feed` を呼び出すことで実行されます。

## 5. ダウン・死亡・帰還メカニズム (Downed, Death & Return)

### 5.1 ダウン状態 (`downed`)
- **発生条件**: 同行モンスターの HP が 0 に到達した場合、即座には死亡せず **ダウン状態（`downed`）** に移行します。
- **ダウン中の挙動**:
  - 行動不可（移動・攻撃不可）となり、その場に倒れ込みます。
  - **カウントダウン**: 30 ティック（約 30 秒）のダウンタイマーが作動します。
- **蘇生 (Revive)**:
  - プレイヤーが隣接マスで「蘇生アイテム（例: `scroll_revive`, `elixir_life` 等）」を使用するか、特定の神聖施設（[祭壇システム](Altar-System.md)）を利用することで HP 25% で復帰させることができます。

### 5.2 帰還ロジック
- **強制帰還**: 以下の場合、同行モンスターは即座に探索から離脱し、拠点の[倉庫システム](Warehouse-System.md)へ自動帰還します。
  1. ダウン状態のまま 30 ティックが経過した場合。
  2. モンスターがダウン状態のまま、プレイヤーが階段を移動して別階層へ移動した場合。
  3. プレイヤー自身が死亡・全滅した場合。
- **帰還後の状態**: 倉庫へ送られたモンスターは **活力 (`vigor`) が 0** の状態（`status = 'idle'`）になります。再デプロイには宿屋・休憩所（[拠点システム](Base-System.md)）等での活力回復が必要です。

## 6. REST API 仕様 (REST API Specifications)

### 6.1 同行デプロイ (Deploy Companion)
- **エンドポイント**: `POST /api/player/{userId}/companion/deploy`
- **リクエスト**: `CompanionDeployRequest`
  ```typescript
  interface CompanionDeployRequest {
    monsterId: string; // 倉庫内の対象モンスター個体ID
  }
  ```
- **レスポンス**: `CompanionDeployResult`
  ```typescript
  interface CompanionDeployResult {
    success: boolean;
    companionState?: CompanionState;
    consumedVigor: number; // 消費された活力 (標準 30)
    message: string;
  }
  ```

### 6.2 同行解除 (Dismiss Companion)
- **エンドポイント**: `DELETE /api/player/{userId}/companion/dismiss`
- **レスポンス**: `CompanionDismissResult`
  ```typescript
  interface CompanionDismissResult {
    success: boolean;
    returnedMonsterId?: string;
    message: string;
  }
  ```

### 6.3 作戦更新 (Update Tactic)
- **エンドポイント**: `PUT /api/player/{userId}/companion/tactic`
- **リクエスト**: `CompanionTacticUpdateRequest`
  ```typescript
  interface CompanionTacticUpdateRequest {
    tactic: 'aggressive' | 'defensive' | 'support' | 'follow';
  }
  ```
- **レスポンス**: `CompanionTacticUpdateResult`
  ```typescript
  interface CompanionTacticUpdateResult {
    success: boolean;
    currentTactic: 'aggressive' | 'defensive' | 'support' | 'follow';
    message: string;
  }
  ```

### 6.4 エサやり (Feed Companion)
- **エンドポイント**: `POST /api/player/{userId}/companion/feed`
- **リクエスト**: `CompanionFeedRequest`
  ```typescript
  interface CompanionFeedRequest {
    itemId: string; // 消費する食料アイテムの個体ID
  }
  ```
- **レスポンス**: `CompanionFeedResult`
  ```typescript
  interface CompanionFeedResult {
    success: boolean;
    healedHp: number;
    recoveredSatiety: number;
    consumedItemId: string;
    message: string;
  }
  ```

## 7. イベントログ構造 (`companion_event`)

同行システムに関する全アクション（デプロイ、作戦変更、エサやり、ダウン、蘇生等）は `DungeonEvent` の `companion_event` として記録されます（[管理者データモデル](../implementation/Admin-Data-Models.md) 参照）。

```typescript
interface CompanionEventDetails {
  action: 'deploy' | 'dismiss' | 'tactic_change' | 'feed' | 'downed' | 'revived';
  monsterId: string;
  monsterTypeId: string;
  tactic?: 'aggressive' | 'defensive' | 'support' | 'follow';
  consumedItemId?: string;
  healedHp?: number;
  position?: { x: number; y: number };
}
```

## 8. 相互参照
- [モンスターシステム](Monster-System.md)
- [倉庫システム](Warehouse-System.md)
- [活力システム](Vigor-System.md)
- [満腹度システム](Hunger-System.md)
- [アクションシステム](Action-System.md)
- [拠点システム](Base-System.md)
- [UI・UX設計](UI-UX-Design.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
