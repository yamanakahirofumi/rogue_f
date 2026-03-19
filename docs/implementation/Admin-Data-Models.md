# Admin-Data-Models

## 1. 概要
本ドキュメントでは、管理者が自身のダンジョン（マイ・ダンジョン）や世界を運営・管理するために必要なデータモデルを定義します。これらのモデルは、バックエンドとの API 通信や、管理画面（`/admin`）における状態管理に使用されます。

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
  stats: any;              // 詳細ステータス
  traits: string[];        // 継承された特性
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

## 6. 相互参照
- [機能仕様書](../features/Functional-Specification.md)
- [管理者システム](../features/Admin-System.md)
- [倉庫システム](../features/Warehouse-System.md)
- [ショップシステム](../features/Shop-System.md)
- [実装詳細](Implementation-Details.md)
