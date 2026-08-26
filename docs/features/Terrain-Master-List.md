# Terrain-Master-List

## 1. 概要
本ドキュメントでは、RogueF における各種地形（Terrain）の詳細仕様、環境効果、管理者の設置コスト、および関連システムとの相互作用を定義します。
地形はダンジョン生成時にランダムに配置されるほか、[建築システム](Construction-System.md) を通じて管理者が意図的に配置・拡張することが可能です。

## 2. 地形種別と効果一覧

各地形が持つ固有の効果、移動・視界制御、設置コスト（資材およびゴールド）、およびマップ描画で使用される文字記号の定義です。

| typeId | 名称 | 記号 | 通行 | 視界遮蔽 | 設置コスト (資材) | 設置コスト (G) | 環境効果・機能詳細 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `floor` | 床 | `.` | ○ | × | `wood` × 1 または `stone` × 1 | 0 | 基本的な移動可能エリア。環境デバフなし。 |
| `wall` | 壁 | `#` | × | ○ | `stone` × 2 | 0 | 通行不能かつ視界を遮断。 |
| `door` | 扉 | `+` | 条件 | 開: × / 閉: ○ | `wood` × 5, `iron` × 1 | 0 | 部屋の出入り口。通常は閉状態（通行不可・視界遮蔽）。インタラクションにより開閉可能。 |
| `water` | 水 | `~` | ○ | × | `magic_crystal` × 1 | 0 | 行動（移動・攻撃等）のインターバルが **2.0 倍** になる。水棲・水属性エンティティは影響を無効化。 |
| `lava` | 溶岩 | `!` | ○ | × | `demon_blood` × 1 | 0 | そのマスに滞在・行動ごとに **5 HP** の固定ダメージを受ける。火属性・飛行モンスターは受傷を無効化。 |
| `sand` | 砂地 | `:` | ○ | × | `stone` × 2 | 0 | 行動インターバルが **1.5 倍** になる。氷雪バイオームにおいては「氷の床」に変化。 |

## 3. 属性・特性・バイオームによる影響の緩和と変化

特定の「属性（Attribute）」、「特性（Traits）」、または滞在する「バイオーム（Biome）」により、地形効果は軽減・無効化・あるいは変化します。

### 3.1 属性による環境効果の軽減
- **水属性 (`water`)**: 水地形（`water`）による行動インターバル遅延（2.0倍）を無効化します。
- **火属性 (`fire`)**: 溶岩地形（`lava`）による行動時ダメージ（5 HP）を無効化します。
- **木属性 (`wood`)**: 森林バイオーム内の砂地地形（`sand`）における移動低下補正を一部軽減します。
- 詳細は **[属性システム](Attribute-System.md#3-環境との相互作用-environment-interactions)** を参照してください。

### 3.2 モンスター特性による地形無効化
- **飛行 (`flying`)**: 全ての地形マイナス効果（水・砂地の移動遅延、溶岩ダメージ）および地形トラップを無効化して移動可能。
- **水棲 (`aquatic`)**: 水地形での移動減速を無視し、水マス上での回避率が **+20%** 向上。
- 詳細は **[モンスター特性リスト](Monster-Trait-List.md)** を参照してください。

### 3.3 バイオームによる動的地形変化
- **氷雪バイオーム (`ice`)**:
  - 砂地タイル（`sand` / `:`）は「氷の床」として機能します。乗ったエンティティは **30% の確率はで進行方向に 1 マス追加で滑る** 現象が発生します（追加行動時間・ST消費なし）。
- **溶岩バイオーム (`lava`)**:
  - 溶岩タイル（`lava` / `!`）に隣接するマスでアイテムドロップ判定が行われた場合、`magic_stone` (魔力石) のドロップ率が **+10%** 向上します。
- 詳細は **[バイオーム・環境システム](Biome-System.md)** を参照してください。

## 4. データ構造とデータモデル

ゲームシステムおよびAPI等で使用される地形マスタ情報の基本データ構造（`TerrainEntry`）の定義です。
TypeScript の型定義は `src/@types/admin.d.ts` に配置されます。

```typescript
export interface TerrainEntry {
  typeId: 'floor' | 'wall' | 'door' | 'water' | 'lava' | 'sand';
  name: string;
  symbol: string;
  isPassable: boolean;
  blocksVision: boolean;
  costs: { typeId: string; amount: number }[];
  goldCost: number;
  effect: {
    intervalMultiplier?: number;
    damagePerAction?: number;
    biomeOverride?: string;
  };
}
```

## 5. 相互参照
- [建築システム](Construction-System.md)
- [戦闘システム](Combat-System.md)
- [属性システム](Attribute-System.md)
- [バイオーム・環境システム](Biome-System.md)
- [モンスター特性リスト](Monster-Trait-List.md)
- [アクションシステム](Action-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
