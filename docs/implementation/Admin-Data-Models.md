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
| typeId | 名称 | 設置コスト (資材) | 設置コスト (ゴールド) | 容量消費 | 効果・備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `recovery_spring` | 回復の泉 | 魔力結晶 × 20 | 5,000 | 20 | HP/スタミナの継続回復。 |
| `teleport_gate` | 転送門 | 魔力結晶 × 15 | 3,000 | 15 | 指定座標へのワープ。 |
| `shop_counter` | ショップカウンター | 木材 × 10, 鉄材 × 2 | 2,000 | 10 | ショップ機能の有効化。 |

### 6.2 基本資材 (Basic Materials)
| typeId | 名称 | 入手方法 | 用途 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `wood` | 木材 | 探索/解体 | 床、扉、家具の作成。 | 基本構造物の素材。 |
| `stone` | 石材 | 探索/解体 | 壁、強固な構造物の作成。 | 壁 1 つにつき 2 個消費。 |
| `iron` | 鉄材 | 探索/解体 | 特殊装置、補強パーツ。 | 扉やトラップの素材。 |
| `magic_crystal` | 魔力結晶 | 探索/合成 | 魔法施設、特殊アイテム。 | 施設の核、階層拡張。 |

### 6.3 特殊・装飾資材 (Special & Decoration Materials)
| typeId | 名称 | 入手方法 | 用途 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `trap_parts` | トラップ部品 | 探索/解体 | トラップの作成・強化。 | [トラップシステム](../features/Trap-System.md) 参照。 |
| `obsidian` | 黒曜石 | 探索 (深層) | 強力なトラップや装飾。 | 希少な硬質素材。 |
| `torch` | 松明 | 探索/木材合成 | ダンジョン内の照明。 | 視界の確保に影響。 |
| `statue` | 彫像 | 探索/石材合成 | 装飾、特殊効果（予定）。 | 容量を 5 消費する。 |

### 6.4 トラップ種別 (Trap Types)
| typeId | 名称 | 設置コスト (資材) | 設置コスト (ゴールド) | 容量消費 | 難易度 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `spikes` | トゲの床 | 石材 (`stone`) × 5 | 500 | 2 | 20 |
| `landmine` | 地雷 | 鉄材 (`iron`) × 5, トラップ部品 × 3 | 1,500 | 4 | 50 |
| `poison_needle` | 毒矢 | トラップ部品 × 5 | 800 | 3 | 35 |
| `alarm` | 警報 | トラップ部品 × 3 | 1,000 | 2 | 25 |
| `slow_trap` | 鈍足の罠 | 魔力結晶 (`magic_crystal`) × 2 | 1,200 | 3 | 40 |
| `teleport_trap` | ワープの罠 | 魔力結晶 (`magic_crystal`) × 5 | 2,000 | 5 | 60 |
| `summon_trap` | 召喚の罠 | 魔力結晶 (`magic_crystal`) × 10 | 3,000 | 8 | 70 |
| `equip_remover` | 装備外しの罠 | 鉄材 (`iron`) × 10, 黒曜石 (`obsidian`) × 2 | 2,500 | 6 | 55 |

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

## 8. 相互参照
- [機能仕様書](../features/Functional-Specification.md)
- [管理者システム](../features/Admin-System.md)
- [倉庫システム](../features/Warehouse-System.md)
- [ショップシステム](../features/Shop-System.md)
- [実装詳細](Implementation-Details.md)
