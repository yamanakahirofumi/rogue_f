# Trap-Master-List

## 1. 概要
本ドキュメントでは、RogueF における全トラップのマスターリストを定義します。各トラップの設置コスト、容量消費、発見・解除の難易度、および詳細効果を規定し、実装およびバランス調整の基準とします。

## 2. トラップ詳細一覧

各トラップの設置に必要なコスト（資材・ゴールド）、容量消費、発見・解除難易度、および効果の一覧です。

| typeId | 名称 | 属性 | 設置コスト (資材) | 設置コスト (G) | 容量消費 | 難易度 | 効果・備考 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `spikes` | トゲの床 | 無 | `stone` × 5 | 500 | 2 | 20 | 基本威力 10。 |
| `landmine` | 地雷 | 火 | `iron` × 5, `magic_crystal` × 1 | 1,500 | 4 | 50 | 基本威力 30。周囲 1 マスにもダメージ適用。 |
| `poison_needle` | 毒矢 | 木 | `iron` × 2, `magic_crystal` × 1 | 800 | 3 | 35 | 「毒」状態を付与。 |
| `alarm` | 警報 | 無 | `iron` × 1, `magic_crystal` × 1 | 1,000 | 2 | 25 | 半径 10 マスのモンスターを追尾状態に。30% でスタン。 |
| `slow_trap` | 鈍足の罠 | 水 | `magic_crystal` × 2 | 1,200 | 3 | 40 | 「鈍足」状態を付与。 |
| `confusion_trap` | 混乱の罠 | 闇 | `magic_crystal` × 3 | 1,500 | 4 | 45 | 「混乱」状態を付与。 |
| `blindness_trap` | 盲目の罠 | 光 | `magic_crystal` × 2 | 1,000 | 3 | 35 | 「盲目」状態を付与。 |
| `teleport_trap` | ワープの罠 | 無 | `magic_crystal` × 5 | 2,000 | 5 | 60 | 同階層のランダム座標へ転送。 |
| `summon_trap` | 召喚の罠 | 闇 | `magic_crystal` × 10 | 3,000 | 8 | 70 | 周囲 8 マスに階層 Tier のモンスターを 2〜4 体召喚。 |
| `equip_remover` | 装備外しの罠 | 光 | `iron` × 10, `magic_stone` × 1 | 2,500 | 6 | 55 | 装備品を 1 つ強制解除（優先度: 武器＞防具＞装飾品。呪いを除く）。 |

## 3. データ構造とデータモデル

ゲームシステムおよび API 等で使用されるトラップマスタ情報の基本データ構造（`TrapEntry`）の定義です。
TypeScript の型定義は `src/@types/admin.d.ts` に配置されます。

```typescript
export interface TrapEntry {
  typeId: string;
  name: string;
  attribute: 'none' | 'fire' | 'water' | 'wood' | 'light' | 'dark';
  costs: { typeId: string; amount: number }[];
  goldCost: number;
  capacityCost: number;
  difficulty: number;
  effectDescription: string;
}
```

## 4. 相互参照
- [トラップシステム](Trap-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [アイテムマスターリスト](Item-Master-List.md)
- [状態異常システム](Status-Effect-System.md)
