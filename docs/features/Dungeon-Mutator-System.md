# ダンジョン変異システム

## 1. システム概要
**ダンジョン変異システム (Dungeon Mutator System)** は、ダンジョン内の特定の階層に対して一時的または一時固定の動的環境特性（フロアミューテーター）を付与し、探索およびダンジョン構築に多様なリスクとリターンをもたらす仕組みです。

プレイヤー（探索者）にとっては予測不能なハザードや特別なボーナスフロアとしての役割を果たし、ダンジョン管理者にとっては資材やゴールドを消費して戦略的に侵入者を迎撃、または特定の素材ドロップ率を高める手段を提供します。

## 2. 変異種別マスターリスト

フロアに適用可能な全 8 種類の変異仕様一覧です。

| 変異ID | 変異名 | カテゴリ | 主な効果・補正倍率 | 視覚演出・UI表示 |
| :--- | :--- | :--- | :--- | :--- |
| `monster_frenzy` | モンスター狂乱 | 脅威 | モンスターの移動・攻撃速度 1.5 倍、出現数 +50%、経験値 1.3 倍 | 画面外縁が赤く点滅 |
| `dense_fog_treasure` | 濃霧と秘宝 | 探索/宝物 | プレイヤー視界半径 -2 マス、宝箱・高級ドロップ出現率 2.0 倍 | 階層全体に濃い霧グラフィック |
| `mana_surge` | マナサージ | 魔法/戦闘 | スキル消費スタミナ 50% 軽減、スキルクールタイム 50% 短縮 | 青い光の粒子が舞う |
| `blood_moon` | ブラッドムーン | 脅威/ドロップ | モンスター攻撃力 1.3 倍、モンスター撃破時レア資材ドロップ率 +30% | マップ全体が赤暗い光調 |
| `gravity_anomaly` | 重力異常 | 移動/行動 | 全エンティティのアクションインターバル 1.3 倍、投擲飛距離 +2 マス | 重力波の歪みエフェクト |
| `blessed_ground` | 聖なる祝福 | 支援/回復 | 自然回復量 2.0 倍、デバフ持続時間 50% 短縮、アンデッド受ダメージ 1.5 倍 | 黄金色のオーラ粒子 |
| `resource_abundance` | 資源豊穣 | リソース | 採掘・釣り・ドロップ資材量 2.0 倍、トラップ発動率 +20% | 緑色の輝き粒子 |
| `curse_plague` | 呪詛の蔓延 | 脅威/デバフ | 装備品呪い付与率 2.0 倍、自然回復停止、獲得ゴールド 1.5 倍 | 紫色の毒霧エフェクト |

## 3. 発生および消滅メカニズム

### 3.1 自然発生ロジック
- ダンジョン生成時、各階層ごとに一定確率（Tier 1: 5%, Tier 2: 10%, Tier 3: 15%）でランダムな変異が 1 種類適用されます。
- モンスターハウスが確定生成されるフロアでは、50% の確率で `monster_frenzy` または `blood_moon` が優先選択されます。

### 3.2 管理者発動メカニズム
- ダンジョン管理者は、管理画面または管理者介入 API (`POST /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator`) を介して、任意の階層に任意の変異を発動できます。
- **発動コスト**: 500 Gold + 木材×10 + 魔水晶の欠片×2
- **クールタイム**: 同一階層への連続発動には 300 ティックのクールタイムが適用されます。
- **持続時間**: 自然発生・管理者発動ともに、適用から 600 ティック（または該当フロアの全プレイヤー脱出）経過で自動消滅します。

## 4. 他システムとの相互作用

- **[昼夜・天候システム](Time-Weather-System.md)**: 天候効果（例: 吹雪、熱波）とフロア変異効果は重複して適用されます。
- **[戦闘システム](Combat-System.md)**: `monster_frenzy` や `blood_moon` 時の倍率補正は、ダメージ計算および行動速度計算の最終段階で乗算されます。
- **[ドロップ品・出現システム](Loot-and-Spawn-System.md)**: `resource_abundance` や `dense_fog_treasure` のドロップ倍率上昇は、基本ドロップテーブルに適用されます。
- **[UI・UX設計](UI-UX-Design.md)**: 変異適用中のフロアでは、HUD のミニマップ上部に変異アイコンと持続時間ゲージが表示されます。

## 5. REST API 仕様

### 5.1 フロア変異手動発動 (Admin)
- `POST /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator`
- 管理者が指定階層に変異を意図的に付与します。
- **リクエスト**: `MutatorTriggerRequest`
- **レスポンス**: `MutatorTriggerResult`

### 5.2 アクティブ変異一覧取得
- `GET /api/dungeon/{dungeonId}/floor/{floorLevel}/mutators`
- 現在指定階層に適用されている変異と残り時間を取得します。
- **レスポンス**: `ActiveFloorMutator[]`

## 6. データモデル定義

```typescript
interface DungeonMutatorEntry {
  id: string;                                                         // 変異ID (例: 'monster_frenzy')
  name: string;                                                       // 変異表示名
  category: 'threat' | 'treasure' | 'magic' | 'support' | 'resource'; // 変異カテゴリ
  description: string;                                                // 効果説明
  durationTicks: number;                                             // 基本持続ティック数 (標準 600)
}

interface ActiveFloorMutator {
  mutatorId: string;         // 適用中の変異ID
  appliedAtTick: number;     // 適用時のゲーム累積ティック
  remainingTicks: number;    // 残り持続ティック数
  isNaturallyGenerated: boolean; // 自然発生フラグ
}

interface MutatorTriggerRequest {
  mutatorId: string;         // 発動する変異のID
}

interface MutatorTriggerResult {
  success: boolean;               // 発動処理の成否
  activeMutator?: ActiveFloorMutator; // 生成された変異状態
  consumedGold?: number;          // 消費ゴールド
  consumedMaterials?: { typeId: string; amount: number }[]; // 消費資材
  message: string;                // 結果メッセージ
}

interface MutatorEventDetails {
  action: 'applied' | 'expired' | 'cleared'; // 変異アクション
  mutatorId: string;              // 変異ID
  isNaturallyGenerated: boolean;  // 自然発生か
  position?: { x: number; y: number };
}
```

## 7. 相互参照
- [ダンジョン生成システム](Dungeon-Generation-System.md)
- [管理者システム](Admin-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [実装詳細](../implementation/Implementation-Details.md)
