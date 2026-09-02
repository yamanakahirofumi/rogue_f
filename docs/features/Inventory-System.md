# Inventory-System

## 1. インベントリの基本コンセプト
インベントリは、プレイヤーがダンジョン探索中に取得したアイテムやゴールドを管理するためのシステムです。リソース管理、戦略的なアイテム使用、および探索の継続性を支える重要な要素です。

## 2. アイテムの種類
[実装詳細](../implementation/Implementation-Details.md) の `PickUpResult` に基づき、以下の種別を管理します。

### 2.1 ゴールド (Type 1)
- ダンジョン内で拾得可能な通貨です。
- 所持金として累積され、インベントリの枠（スロット）は消費しません。
- ショップでの購入やサービスの利用に使用されます。

### 2.2 アイテム (Type 2)
- ダンジョン内で拾得可能な物品です。
- インベントリのスロットを消費して保持します。
- 詳細なアイテムの一覧と効果については、**[アイテムマスターリスト](Item-Master-List.md)** を参照してください。
- 主なサブカテゴリ:
    - **食料 (food)**: [満腹度システム](Hunger-System.md) に基づき、満腹度を回復させます。
    - **巻物 (scroll)**: 使用することで即時効果や特殊な効果を発動します。
    - **薬 (potion)**: 飲むことで回復やステータス変化をもたらします。
    - **装備品 (weapon, armor, accessory)**: プレイヤーのステータスを強化します。詳細は [装備システム](Equipment-System.md) を参照してください。
    - **資材 (material)**: 建築や合成に使用します。

## 3. インベントリの機能

### 3.1 アイテムの取得とスタック制御
- 足元にあるアイテムを「拾う（pickup）」コマンドでインベントリに格納します。
- **インベントリ容量**: 初期状態では **20 スロット** です。
- **スタックルール**:
    - 資材（`material`）や食料（`food`）、エサ・釣り具などのスタック可能なアイテムは、1 スロットに最大 **99 個** までスタック保持できます。
    - アイテム取得時、既にインベントリ内に同一種別かつ同一の状態（識別有無・呪い・祝福が一致）のアイテムが存在する場合、自動的にスロット内で合算（スタック）されます。
    - 99 個を超える分については、空いている新しいスロットへ自動的に分配配置されます。
- インベントリが満杯（全 20 スロットが埋まり、既存スタックも上限到達）の場合、新しいアイテムを拾うことはできません。
- **容量の拡張**: 特定のイベントや拠点施設でのサービスを通じて拡張できる可能性があります。

### 3.2 インベントリの自動整列（ソート）と並び替え
プレイヤーはインベントリ内のアイテムを定義された優先順位に従って即座に自動整列（ソート）するか、手動でスロット位置を入れ替えることができます。

- **自動ソートの優先度階層**:
    1. **サブカテゴリ (`subType`) 順**: `weapon` → `armor` → `accessory` → `food` → `potion` → `scroll` → `material` → `special`
    2. **Tier (`tier`) 順**: 高 Tier 優先（Tier 3 → Tier 2 → Tier 1）
    3. **基本価格 (`value`) 順**: 降順（高額アイテム優先）
    4. **識別状態 (`isIdentified`)**: 識別済みアイテム優先
    5. **名称 (`name`)**: 50 音 / アルファベット昇順
- **スタック自動統合**: ソート実行時、分割されていた同一アイテム（同種別・同一状態）は可能な限り自動的に 1 つのスロットへ統合されます。
- **操作 API**: `PUT /api/player/{userId}/inventory/sort` および `PUT /api/player/{userId}/inventory/swap`

### 3.3 アイテムの使用
- インベントリからアイテムを選択して「使う」ことができます。
- 食料であれば満腹度が回復し、巻物であれば魔法効果が発動します。

### 3.4 アイテムの破棄
- 不要なアイテムを足元に「置く」または「捨てる」ことができます。

### 3.5 アイテムの識別
詳細は [アイテム識別システム](Item-Identification-System.md) を参照してください。

- 一部のアイテムは未識別の状態で入手される場合があります。
- 「鑑定の巻物」を使用するか、実際に使用・装備することで正体が判明します。

## 4. UI・UX 設計
詳細は [UI・UX設計](UI-UX-Design.md) を参照してください。

- **インベントリ画面**: 現在の所持アイテムを一覧表示します。
- **アイテム詳細**: アイテムを選択した際、その名称、説明、および実行可能なアクション（使う、装備する、捨てる等）を表示します。
- **クイック使用**: 頻繁に使用するアイテム（食料、回復薬等）を特定のキー入力やボタンで即座に使用できるショートカット機能の提供を想定しています。

## 5. データモデルの定義

### 5.1 InventoryItem
[Player型定義](../../src/@types/player.d.ts) に基づくデータ構造です。
```typescript
{
  id: string;          // アイテム固有のID
  name: string;        // アイテム名（未識別時は「謎の薬」など）
  originalName: string; // 本来のアイテム名
  type: number;        // アイテム種別（2=アイテム）
  subType: string;     // サブカテゴリ（food, scroll, potion, weapon, armor, accessory, material）
  description: string; // アイテムの説明
  isIdentified: boolean; // 識別済みかどうか
  isCursed: boolean;     // 呪い状態かどうか
  isBlessed: boolean;    // 祝福状態かどうか
  value: number;       // 売却価格/購入価格のベース
  tier: number;        // アイテムの Tier (1, 2, 3)
  // 装備品および道具の補正値
  attackBonus?: number;
  defenseBonus?: number;
  agilityBonus?: number;
  dexterityBonus?: number;
  speedBonus?: number;
  luckBonus?: number;       // 運補正値
  range?: number;           // 武器の射程
  throwAttack?: number;     // 投擲威力
  attribute?: string;       // 属性 (Fire, Water, Wood, Light, Dark, None)
  capacityUsage?: number;   // 配置時に消費するダンジョン容量
  amount?: number;          // 所持数（スタック可能なアイテム用）
}
```

### 5.2 Player (インベントリ拡張)
[Playerモデル](../implementation/Implementation-Details.md) に基づくインベントリ関連の項目です。
```typescript
{
  // ... 既存の項目
  inventory: InventoryItem[]; // 所持アイテムのリスト
  inventoryCapacity: number;  // インベントリの最大容量
}
```
