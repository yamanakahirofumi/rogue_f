# Admin-Data-Models

## 1. 概要
本ドキュメントでは、管理者が自身のダンジョン（マイ・ダンジョン）や世界を運営・管理するために必要なデータモデルを定義します。これらのモデルは、バックエンドとの API 通信や、管理画面（`/admin`）における状態管理に使用されます。
詳細な型定義は [src/@types/admin.d.ts](../../src/@types/admin.d.ts) を参照してください。

## 2. ダンジョン設定 (DungeonConfig)
管理者が作成するダンジョン全体の基本情報を保持します。

```typescript
interface DungeonConfig {
  id: string;              // ダンジョンID
  name: string;            // ダンジョン名
  ownerId: string;         // 管理者のユーザーID
  description: string;     // ダンジョンの説明文
  isPublic: boolean;       // 公開フラグ
  entryFee: number;        // 入場料 (ゴールド)
  totalFloors: number;     // 総階層数
  deathPenalty: DeathPenaltyConfig; // デスペナルティ設定
}

interface DeathPenaltyConfig {
  itemLossRate: number;    // アイテム没収率 (0.0〜1.0)
  goldLossRate: number;    // ゴールド没収率 (0.0〜1.0)
  expLossRate: number;     // 経験値減少率 (0.0〜1.0)
  levelReset: boolean;     // レベル 1 リセットフラグ
}
```

## 3. 階層設定 (FloorConfig)
特定の階層における構造や配置情報を保持します。

```typescript
interface FloorConfig {
  floorLevel: number;      // 階層番号
  width: number;           // マップ幅
  height: number;          // マップ高さ
  tiles: string[][];       // 地形データ (2次元配列)
  monsters: PlacedMonster[]; // 配置済みモンスター
  traps: PlacedTrap[];       // 配置済みトラップ
  shops: PlacedShop[];       // 設置済みショップ
  facilities: PlacedFacility[]; // 設置済み施設
}

interface PlacedFacility {
  typeId: 'recovery_spring' | 'teleport_gate' | 'shop_counter';
  position: { x: number, y: number };
  config?: RecoverySpringConfig | TeleportGateConfig;
}

interface RecoverySpringConfig {
  recoveryRate: number;    // 回復倍率 (標準 1.0)
}

interface TeleportGateConfig {
  targetFloor: number;     // ワープ先階層
  targetPosition: { x: number, y: number }; // ワープ先座標
}

interface PlacedShop {
  shopId: string;          // ショップID
  position: { x: number, y: number };
}

interface PlacedMonster {
  monsterId: string;       // モンスター個体ID (倉庫内ID)
  typeId: string;          // モンスター種別ID
  position: { x: number, y: number };
  aiPattern: string;       // AIパターン (Aggressive, Cowardly等)
}

interface PlacedTrap {
  typeId: string;          // トラップ種別ID
  position: { x: number, y: number };
  isHidden: boolean;       // 初期状態で隠れているか
  difficulty: number;      // 発見・解除の難易度 (1〜100)
}
```

## 4. ショップ設定 (ShopConfig)
ダンジョン内に設置されたショップの運営情報を保持します。

```typescript
interface ShopConfig {
  id: string;              // ショップID
  ownerId: string;         // 管理者ID
  slots: ShopSlot[];       // 陳列スロット
  location: {
    floorLevel: number;
    position: { x: number, y: number };
  };
}

interface ShopSlot {
  itemId: string;          // アイテム個体ID (倉庫内ID)
  price: number;           // 管理者が設定した販売価格
  stock: number;           // 在庫数
}
```

## 5. 倉庫状態 (WarehouseState)
管理者が保有する全リソースのストック情報を保持します。

```typescript
interface WarehouseState {
  monsters: StoredMonster[]; // 保管中のモンスター
  items: StoredItem[];       // 保管中のアイテム
  materials: StoredMaterial[]; // 保管中の建築資材
  trustNetwork: TrustedServer[]; // 信頼しているサーバー
  capacity: {
    monsterMax: number;
    itemMax: number;
    materialMax: number;
  };
}

interface StoredMonster {
  id: string;
  typeId: string;
  level: number;
  exp: number;             // 現在の累積経験値
  nextExp: number;         // 次レベルまでの必要累積経験値
  vigor: number;           // 現在の活力
  maxVigor: number;        // 最大活力
  hatchTimeRemaining?: number; // 孵化までの残り時間（分）。卵の状態の場合のみ存在。
  hatchTimeTotal?: number;     // 孵化に必要な総時間（分）。卵の状態の場合のみ存在。
  stats: MonsterStats;     // 詳細ステータス
  traits: string[];        // 継承された特性
}

interface MonsterStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  agility: number;
  dexterity: number;
  speed: number;
  luck: number;
}

interface StoredItem {
  id: string;
  itemData: InventoryItem; // 基本アイテム情報
  isStocked: boolean;      // ショップに陳列中かどうか
}

interface StoredMaterial {
  typeId: string;
  name: string;
  count: number;           // 所持数
}
```

## 6. 施設と資材の定義

本プロジェクトで使用される具体的な施設および資材の種別 ID の一覧です。

### 6.1 施設種別 (Facility Types)
各施設の詳細なパラメータについては、**[施設マスターリスト](../features/Facility-Master-List.md)** を参照してください。

### 6.2 基本・特殊資材 (Basic & Special Materials)
資材の詳細なパラメータ、入手方法、および用途については、**[アイテムマスターリスト](../features/Item-Master-List.md#7-資材-materials)** を参照してください。

### 6.3 トラップ種別 (Trap Types)
各トラップの詳細なパラメータについては、**[トラップマスターリスト](../features/Trap-Master-List.md)** を参照してください。

## 7. トラストネットワーク (Trust Network)
他の管理者サーバーとの連携に関するデータを保持します。

```typescript
interface TrustedServer {
  serverId: string;        // サーバー固有のID
  serverName: string;      // サーバー名
  url: string;             // サーバーのエンドポイントURL
  trustPolicy: TrustPolicy; // 適用されている信頼ポリシー
  status: 'active' | 'pending' | 'blocked'; // 信頼関係の状態
}

interface TrustPolicy {
  itemTransfer: 'bi-directional' | 'one-way' | 'prohibited'; // アイテム持ち込み制限
  levelSync: 'full-sync' | 'copy-on-move' | 'reset';        // レベル同期設定
  canPvp: boolean;         // サーバー間を跨いだPVPの許可
}
```

## 8. 管理ログ (Admin & Dungeon Logs)
ダンジョン内のイベントや管理者の操作を記録するためのデータ構造です。

```typescript
interface DungeonEvent {
  id: string;              // イベント固有ID
  timestamp: number;       // 発生時刻 (UNIXタイムスタンプ)
  dungeonId: string;       // 発生したダンジョンのID
  floorLevel: number;      // 発生した階層
  type: DungeonEventType;  // イベント種別
  userId?: string;         // 関連するユーザーID (プレイヤー等)
  details: PlayerEntryDetails | PlayerExitDetails | PlayerDeathDetails | ItemPickUpDetails | MonsterSlainDetails | TrapTriggeredDetails | AdminInterventionDetails;
}

type DungeonEventType =
  | 'player_entry'         // プレイヤー入場
  | 'player_exit'          // プレイヤー脱出
  | 'player_death'         // プレイヤー死亡
  | 'item_pickup'          // 重要アイテム取得
  | 'monster_slain'        // モンスター撃破
  | 'trap_triggered'       // トラップ発動
  | 'admin_intervention';  // 管理者介入

interface AdminLog {
  id: string;              // ログ固有ID
  timestamp: number;       // 操作時刻
  adminId: string;         // 管理者のユーザーID
  action: AdminActionType; // 操作種別
  targetId?: string;       // 対象のID (dungeonId, shopId等)
  changes: {
    before: any;           // 変更前
    after: any;            // 変更後
  };
}

type AdminActionType =
  | 'create_dungeon'       // ダンジョン作成
  | 'update_floor'         // 階層更新
  | 'update_shop_price'    // ショップ価格更新
  | 'update_trust_policy'  // 信頼ポリシー更新
  | 'intervene_player';    // プレイヤーへの介入
```

## 9. 相互参照
- [機能仕様書](../features/Functional-Specification.md)
- [管理者システム](../features/Admin-System.md)
- [倉庫システム](../features/Warehouse-System.md)
- [ショップシステム](../features/Shop-System.md)
- [実装詳細](Implementation-Details.md)
