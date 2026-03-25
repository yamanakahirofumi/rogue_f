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
  typeId: string;          // 施設種別ID (recovery_spring, teleport_gate等)
  position: { x: number, y: number };
  config?: any;            // 施設固有の設定 (ワープ先座標等)
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
| typeId | 名称 | 効果 | 備考 |
| :--- | :--- | :--- | :--- |
| `recovery_spring` | 回復の泉 | 触れている間、HP とスタミナが徐々に回復する。 | 自然回復とは別枠。 |
| `teleport_gate` | 転送門 | 特定の座標（同一階層内）へワープする。 | `config` にワープ先を指定。 |
| `shop_counter` | ショップカウンター | 隣接して話しかけることでショップ画面を開く。 | [ショップシステム](../features/Shop-System.md) と連動。 |

### 6.2 基本資材 (Basic Materials)
| typeId | 名称 | 用途 |
| :--- | :--- | :--- |
| `wood` | 木材 | 床、扉、簡易的な家具の作成。 |
| `stone` | 石材 | 壁、強固な構造物の作成。 |
| `iron` | 鉄材 | 特殊な装置、補強パーツの作成。 |
| `magic_crystal` | 魔力結晶 | 魔法的な施設（転送門、回復の泉）の核。 |

### 6.3 特殊・装飾資材 (Special & Decoration Materials)
| typeId | 名称 | 用途 |
| :--- | :--- | :--- |
| `trap_parts` | トラップ部品 | 基本的なトラップの作成・強化。 |
| `obsidian` | 黒曜石 | 強力なトラップや装飾。 |
| `torch` | 松明 | ダンジョン内の照明。 |
| `statue` | 彫像 | 装飾および特定の効果（検討中）。 |

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
