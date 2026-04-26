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
  - 基本コマンド: `top`, `down`, `right`, `left`, `pickup`, `downStairs`, `upStairs`, `wait`
  - 探索・解除コマンド:
    - `search`: 周囲のトラップや隠し通路を探索。
      - レスポンス: `SearchResult`
    - `disarm`: 足元のトラップの解除を試行。
    - `disarm/{direction}`: 指定した方向（`top`, `down`, `right`, `left`）に隣接するトラップの解除を試行。
      - レスポンス: `DisarmResult`
  - アクションコマンド:
    - `attack`: 隣接する敵に攻撃を実行。
    - `attack/{targetId}`: 指定したIDの対象に攻撃を実行（遠距離攻撃等）。
    - `use/{itemId}`: アイテムを使用。
    - `use/{itemId}/{targetId}`: 指定した対象にアイテムを使用。
    - `equip/{itemId}`: アイテムを装備。
    - `unequip/{itemId}`: 装備を解除。
    - `drop/{itemId}`: アイテムを足元に置く。
  - レスポンス (上記以外): `{ [name: string]: boolean }`
  - レスポンス (pickup): `PickUpResult`
  - レスポンス (search): `SearchResult`
  - レスポンス (disarm): `DisarmResult`
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

### 2.5 管理者向け API (Admin API)
管理者が世界を構築・運営するためのエンドポイントです。

- **ダンジョン管理**
  - `POST /api/admin/dungeon`: 新規ダンジョンの作成。
    - リクエスト: `DungeonConfig` (idはサーバー生成)
  - `GET /api/admin/dungeons`: 管理者が所有するダンジョン一覧の取得。
    - レスポンス: `DungeonConfig[]`
  - `PUT /api/admin/dungeon/{dungeonId}/floor/{floorLevel}`: 特定階層の構成（マップ、配置物）の更新。
    - リクエスト: `FloorConfig`
- **倉庫・リソース管理**
  - `GET /api/admin/warehouse`: 倉庫の状態（モンスター、アイテム、資材）を取得。
    - レスポンス: `WarehouseState`
  - `POST /api/admin/warehouse/monster/breed`: モンスターの繁殖を実行。
    - リクエスト: `{ parentId1: string, parentId2: string }`
    - レスポンス: `StoredMonster` (生成された卵/幼体)
- **ショップ管理**
  - `POST /api/admin/shop`: ダンジョン内にショップを新規設置。
    - リクエスト: `ShopConfig`
  - `PUT /api/admin/shop/{shopId}/slots`: ショップの陳列商品と価格を更新。
    - リクエスト: `ShopSlot[]`
- **トラストネットワーク (世界間連携)**
  - `GET /api/admin/trust-network`: 信頼関係にあるサーバーの一覧を取得。
    - レスポンス: `TrustedServer[]`
  - `POST /api/admin/trust-network/server`: 新しいサーバーとの信頼関係を構築（申請）。
    - リクエスト: `{ serverUrl: string, policy: TrustPolicy }`
  - `PUT /api/admin/trust-network/server/{serverId}`: 信頼ポリシーの更新。
    - リクエスト: `TrustPolicy`
- **ログ管理**
  - `GET /api/admin/logs/dungeon/{dungeonId}`: 指定したダンジョンのイベントログを取得。
    - クエリパラメータ: `limit`, `offset`, `type`
    - レスポンス: `DungeonEvent[]`
  - `GET /api/admin/logs/actions`: 管理者の操作ログを取得。
    - クエリパラメータ: `limit`, `offset`, `action`
    - レスポンス: `AdminLog[]`

### 2.6 管理者介入 API (Admin Intervention API)
攻略中の特定のプレイヤーに対し、リアルタイムで干渉するためのエンドポイントです。

- **モンスター召喚**
  - `POST /api/admin/intervention/player/{userId}/summon`: 倉庫内のモンスターを対象のプレイヤーが攻略中のフロアに即座に召喚。
    - リクエスト: `{ monsterId: string, position: { x: number, y: number } }`
    - レスポンス: `boolean` (召喚成功の成否)
- **トラップ・効果の発動**
  - `POST /api/admin/intervention/player/{userId}/trigger`: 指定した座標のトラップを強制的に発動、または特殊な環境効果（落雷、落石等）を発生させる。
    - リクエスト: `{ position: { x: number, y: number }, effectId?: string }`
    - レスポンス: `boolean` (発動成功の成否)

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
  monsterLevel?: number; // モンスター形態のレベル (PK用)
  monsterExp?: number;   // モンスター形態の累積経験値 (PK用)
  monsterNextExp?: number; // モンスター形態の次レベルまでの必要累計経験値 (PK用)
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
  tier: number;        // アイテムの Tier (1, 2, 3)
  // 装備品の場合の補正値
  attackBonus?: number;
  defenseBonus?: number;
  agilityBonus?: number;
  dexterityBonus?: number;
  speedBonus?: number;
  range?: number;
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

### 3.7 SearchResult
```typescript
{
  foundCount: number;  // 発見したトラップ・隠し通路の数
  message: string;     // 結果メッセージ
}
```

### 3.8 DisarmResult
```typescript
{
  result: boolean;     // 解除成否
  isTriggered: boolean; // 解除失敗時にトラップが発動したか
  message: string;     // 結果メッセージ
}
```

## 4. フィールドマップ記号 (Field Map Symbols)
ダンジョンの描画データ（`DisplayData`）で使用される主な記号と、それが表すオブジェクトの定義です。

| 記号 | オブジェクト | 備考 |
| :--- | :--- | :--- |
| `@` | プレイヤー (Self) | 自身の現在位置。 |
| `P` | 他のプレイヤー (Other Player) | 同じ階層を探索中の他プレイヤー。 |
| `#` | 壁 (Wall) | 通行不能な境界。 |
| `.` | 床 (Floor) | 移動可能なエリア。 |
| `M` | モンスター (Monster) | 敵対的または中立のエンティティ。 |
| `G` | ゴールド (Gold) | 拾得可能な通貨。 |
| `I` | アイテム (Item) | 武器、防具、消耗品等のアイテム。 |
| `^` | トラップ (Trap) | 発見済みの罠。 |
| `+` | 扉 (Door) | 部屋の出入り口。開閉可能。 |
| `&` | 回復の泉 (Recovery Spring) | 触れている間、HP/スタミナを回復。 |
| `O` | 転送門 (Teleport Gate) | 階層内の別地点へワープ。 |
| `>` | 下り階段 (Down Stairs) | 次の階層へ進む。 |
| `<` | 上り階段 (Up Stairs) | 前の階層へ戻る（または脱出）。 |
| `$` | ショップ (Shop) | アイテムの売買が可能な場所。 |
| `~` | 水 (Water) | 移動・行動に時間がかかる。 |
| `!` | 溶岩 (Lava) | 踏むとダメージを受ける。 |
| `:` | 砂地 (Sand) | 移動・行動がわずかに遅くなる。 |

## 5. 技術的詳細

### 5.1 主要サービス
- **FieldsAccessService**: 全てのHTTPリクエスト（REST API）を統括します。
- **SseFieldService**: `EventSource` を使用し、バックエンドからのフィールド更新イベントをリアルタイムに受信します。
- **IntervalService**: `rxjs` の `interval` をラップし、ゲーム内の定期的なイベント（スタミナ回復等）のトリガーを提供します。
- **StorageService**: ブラウザの `localStorage` へのアクセスをカプセル化し、プレイヤー情報の永続化等を行います。

### 5.2 リアルタイム更新 (SSE)
- `SseFieldService` を通じて `GET /api/fields/{userId}` から配信されるイベントを購読します。
- 他のプレイヤーの移動や環境の変化がリアルタイムに反映されます。

### 5.3 セッション管理
- `StorageService` を使用して、ブラウザの `localStorage` に `playerId` を保存します。

### 5.4 フロントエンドでの状態管理
- `PlayerDomain` クラスがプレイヤーの現在の状態（HP、スタミナ等）を管理しています。
- 内部的に `CurrentStatus` クラスを持ち、HP/スタミナの動的な変更を扱います。
- サーバーから取得した `Player` オブジェクトに基づき、HP、スタミナ、最大HP、最大スタミナが初期化されます。

### 5.5 アクション・回復のフロントエンド制御ロジック

#### アクションインターバル管理
- プレイヤーの各行動には、[アクションシステム](../features/Action-System.md)に基づいた待機時間（インターバル）を適用します。
- クライアント側では `actionTime` と `agility` を用いて、次の行動が可能かどうかを判定します。
  - `実効インターバル = 基本インターバル / (1 + 敏捷性 / 100)`
- 地形（水、砂地）や状態異常（鈍足）による補正倍率を基本インターバルに乗算します。

#### 満腹度とスタミナの消費
- **時間経過**: [満腹度システム](../features/Hunger-System.md)に基づき、満腹度が減少します。
- **アクション消費**: [満腹度システム](../features/Hunger-System.md)および[アクションシステム](../features/Action-System.md)に基づき、満腹度およびスタミナが減少します。
- スタミナが不足している場合は HP を消費します。詳細は[アクションシステム](../features/Action-System.md)を参照してください。

#### 自然回復の周期処理
- [自然回復システム](../features/Natural-Recovery-System.md)に基づき、一定周期（1ティック）ごとに HP とスタミナが回復します。
- 満腹度の状態（満腹、空腹、飢餓）に応じた回復補正が適用されます。
