# Implementation-Details

## 1. クラス設計とロジックの概要
詳細は [アーキテクチャ設計](../tech/Architecture.md) を参照してください。

## 2. APIリファレンス

### 2.1 ユーザー管理
- `GET /api/user/name/{name}/exist`: ユーザー名の存在確認。
  - レスポンス: `boolean`
- `POST /api/user/name/{name}`: ユーザー作成。
  - レスポンス: `string` (作成されたユーザーのID)

### 2.2 プレイヤー情報
- `GET /api/player/{userId}`: プレイヤー情報の取得。
  - レスポンス: `Player`
- `PUT /api/player/{userId}/command/{command}`: 移動やアクションのコマンド送信。
  - 基本コマンド: `top`, `down`, `right`, `left`, `pickup`, `downStairs`, `upStairs`
  - 探索・解除コマンド:
    - `search`: 周囲のトラップや隠し通路を探索。
    - `disarm`: 隣接するトラップの解除を試行。
  - アクションコマンド:
    - `attack`: 隣接する敵に攻撃を実行。
    - `attack/{targetId}`: 指定したIDの対象に攻撃を実行（遠距離攻撃等）。
    - `use/{itemId}`: アイテムを使用。
    - `equip/{itemId}`: アイテムを装備。
    - `unequip/{itemId}`: 装備を解除。
    - `drop/{itemId}`: アイテムを足元に置く。
  - レスポンス (pickup, attack 以外): `{ [name: string]: boolean }`
  - レスポンス (pickup): `PickUpResult`
  - レスポンス (attack): `CombatResult` (詳細は 3.6 参照)

### 2.3 フィールド・ダンジョン
- `GET /api/fields/{userId}/now`: フィールドの現在の状態取得。
  - レスポンス: `DisplayData[]`
- `GET /api/fields/{userId}/info`: ダンジョン情報の取得。
  - レスポンス: `DungeonInfo`
- `POST /api/player/{userId}/command/dungeon/default`: ダンジョンへの入場。
- `GET /api/fields/{userId}` (SSE): フィールドのリアルタイム更新。
  - ストリーム要素: `DisplayData`

### 2.4 管理者向けデータ
- 管理者がダンジョンや倉庫を運営するためのデータ構造については、以下のドキュメントを参照してください。
  - **[管理者データモデル](Admin-Data-Models.md)**: ダンジョン設定、階層配置、ショップ運営、および倉庫の状態管理。

## 3. データモデル

### 3.1 Player
```typescript
{
  id: string;        // ユーザーID
  name: string;      // ユーザー名
  gold: number;      // 所持ゴールド
  level: number;     // レベル
  exp: number;       // 現在の累積経験値
  nextExp: number;   // 次レベルまでに必要な累計経験値
  hp: number;        // 現在のHP
  maxHp: number;     // 最大HP
  stamina: number;   // 現在のスタミナ
  maxStamina: number; // 最大スタミナ
  satiety: number;   // 現在の満腹度
  maxSatiety: number; // 最大満腹度
  attack: number;    // 攻撃力
  defense: number;   // 防御力
  agility: number;   // 敏捷性（攻撃速度に影響）
  dexterity: number; // 器用さ（命中率に影響）
  speed: number;     // 素早さ（回避率に影響）
  luck: number;      // 運（トラップ発見率などに影響）
  actionTime: number; // 最終行動時刻のタイムスタンプ
  weaponId?: string;    // 装備中の武器のID
  armorId?: string;     // 装備中の防具のID
  accessoryId?: string; // 装備中の装飾品のID
  inventory: InventoryItem[]; // 所持アイテムのリスト
  inventoryCapacity: number;  // インベントリの最大容量
  statusEffects: string[];    // 付与されている状態異常のリスト
}
```

### 3.2 DisplayData
```typescript
{
  position: {
    x: number;
    y: number;
  };
  data: string[];    // 描画データの配列（指定した y 行の x 列目以降を上書き）
}
```

### 3.3 DungeonInfo
```typescript
{
  name: string;      // ダンジョン名
  level: number;     // 現在の階層
}
```

### 3.4 PickUpResult
```typescript
{
  result: boolean;   // 取得成否
  type: number;      // アイテム種別: 1=ゴールド, 2=アイテム
  gold?: number;     // 取得したゴールド量 (type=1の場合)
  itemName?: string; // 取得したアイテム名 (type=2の場合)
  message: string;   // エラーメッセージ等 (例: 'NoObjectOnTheFloor')
}
```

### 3.5 InventoryItem
```typescript
{
  id: string;
  name: string;
  originalName: string;
  type: number;
  subType: string;
  description: string;
  isIdentified: boolean;
  isCursed: boolean;
  isBlessed: boolean;
  value: number;
  // 装備品の場合の補正値
  attackBonus?: number;
  defenseBonus?: number;
  agilityBonus?: number;
  dexterityBonus?: number;
  speedBonus?: number;
}
```

### 3.6 CombatResult
```typescript
{
  attackerId: string;  // 攻撃者のID
  targetId: string;    // 攻撃対象のID
  isHit: boolean;      // 命中したかどうか
  damage: number;      // 与えたダメージ量
  critical: boolean;   // クリティカルヒットかどうか
  remainingHp: number; // 攻撃後の対象の残りHP
  isDead: boolean;     // 対象が死亡したかどうか
}
```

## 4. 技術的詳細

### 4.1 主要サービス
- **FieldsAccessService**: 全てのHTTPリクエスト（REST API）を統括します。
- **SseFieldService**: `EventSource` を使用し、バックエンドからのフィールド更新イベントをリアルタイムに受信します。
- **IntervalService**: `rxjs` の `interval` をラップし、ゲーム内の定期的なイベント（スタミナ回復等）のトリガーを提供します。
- **StorageService**: ブラウザの `localStorage` へのアクセスをカプセル化し、プレイヤー情報の永続化等を行います。

### 4.2 リアルタイム更新 (SSE)
- `SseFieldService` を通じて `GET /api/fields/{userId}` から配信されるイベントを購読します。
- 他のプレイヤーの移動や環境の変化がリアルタイムに反映されます。

### 4.3 セッション管理
- `StorageService` を使用して、ブラウザの `localStorage` に `playerId` を保存します。

### 4.4 フロントエンドでの状態管理
- `PlayerDomain` クラスがプレイヤーの現在の状態（HP、スタミナ等）を管理しています。
- 内部的に `CurrentStatus` クラスを持ち、HP/スタミナの動的な変更を扱います。
- サーバーから取得した `Player` オブジェクトに基づき、HP、スタミナ、最大HP、最大スタミナが初期化されます。
