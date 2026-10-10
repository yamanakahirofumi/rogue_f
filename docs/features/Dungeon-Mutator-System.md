# Dungeon-Mutator-System

## 1. 概要
ダンジョンミューテーター（階層変異）システムは、ダンジョンの特定の階層に一定時間または恒常的に発生する特殊な環境効果・変異ルール（ミューテーター）を導入する仕組みです。

探索者にとっては予期せぬリスクとハイリターンをもたらし、ダンジョン管理者にとっては資材やゴールドを消費して戦略的な罠階層やボーナス階層を構築する動的な介入手段となります。また、PKerにとっても不意打ちや有利な戦況を生み出す要素となります。

## 2. ミューテーターの種類と効果
ダンジョン内で発生するミューテーターは以下の 8 種類に分類されます。

| mutatorId | 名称 | 効果概要 | 探索者影響 | 管理者/PKer影響 |
| :--- | :--- | :--- | :--- | :--- |
| `monster_frenzy` | モンスター狂暴化 | 全モンスターの攻撃力・移動速度が **1.5 倍** に上昇。撃破経験値 **1.5 倍**。 | 高リスク・経験値高効率。 | 防衛ラインの強化、侵入撃退率向上。 |
| `dense_fog_treasure` | 濃霧と密輸宝箱 | 視界半径が **1 マス** に縮小。高品質な宝箱（鉄・魔法）の出現率 **3 倍**。 | 視界不良だが高価値アイテム獲得チャンス。 | 隠密配置・ミミック罠の視覚的隠蔽。 |
| `mana_surge` | 魔力奔流 | 全スキルのクールタイム（CT）が **50% 短縮**、消費スタミナ **50% 減少**。 | プレイヤー・モンスター双方のスキル乱舞。 | モンスター特殊スキルの超高頻度発動。 |
| `blood_moon` | ブラッドムーン | PKer の乱入成功率上昇、PKer モンスターの攻撃力 **1.2 倍**。 | PKer 遭遇リスクが大幅増加。 | PKer 協力防衛の誘発。 |
| `gravity_anomaly` | 重力異常 | 移動時の消費スタミナ **2 倍**。ノックバック距離 **+2 マス**。 | 行動リソース管理の負荷増大。 | トラップ設置によるノックバックコンボ。 |
| `blessed_ground` | 聖域化 | プレイヤーの自然回復速度 **2 倍**。アンデッド・闇属性の攻撃力 **0.7 倍**。 | 安全な探索・体制立て直しの場。 | 闇属性モンスターの防衛弱体化リスク。 |
| `resource_abundance` | 豊かな脈動 | アイテム・資材・ドロップ率 **2 倍**。モンスターの出現上限 **1.5 倍**。 | 戦利品大量獲得。 | クラフト資材・ドロップの大量供給。 |
| `curse_plague` | 呪いの蔓延 | アイテム取得時の呪い発生率 **30%**。呪い装備のステータス低下 **1.5 倍**。 | 未鑑定アイテム所持・装備のリスク増大。 | 探索者の装備固定・弱体化狙い。 |

## 3. 発動メカニズムと発生確率

### 3.1 自然発生（ランダム変異）
ダンジョン生成時、または新しいフロアに到達した際、以下の条件で自然発生します。

- **発生確率**: 各階層ごとに **10%**（フロンティアモードでは **20%**）の確率でランダムなミューテーターが 1 種類適用されます。
- **継続時間**: フロア生成から **300 ティック**（約 50 分）、またはプレイヤーが当該階層から離脱するまで持続します。

### 3.2 管理者発動（手動起動）
ダンジョン管理者は、管理パネルまたは API を通じて特定の階層に任意のミューテーターを手動で起動できます。

- **起動コスト**: 1 回の発動につき **500 Gold** および **魔晶石 (`magic_crystal`) × 2**（または各属性資材 × 10）。
- **持続時間**: 起動後 **600 ティック**（100 分間）。
- **クールタイム**: 同一階層での連続起動には **120 ティック** のクールダウンが必要。

## 4. 他システムとの相乗効果

- **[昼夜・天候システム](Time-Weather-System.md)**: 天候効果とミューテーター効果は乗算で重複します（例: 吹雪 `blizzard` + 重力異常 `gravity_anomaly` で移動負荷が極めて高くなる）。
- **[バイオーム・環境システム](Biome-System.md)**: 氷雪バイオームでの重力異常は滑走効果とノックバックが組み合わさり、溶岩バイオームでの狂暴化は火属性ダメージを倍増させます。
- **[ドロップ品・出現システム](Loot-and-Spawn-System.md)**: `resource_abundance` 発動時、サーキュレーション上限内のドロップテーブルが2倍の出現率で適用されます。
- **[PKシステム](PK-System.md)**: `blood_moon` 発動中、PKer マッチメイキングの優先度が繰り上がり、キュー待機時間が短縮されます。
- **[派閥システム](Faction-System.md)**: `mana_surge` や `monster_frenzy` は野生モンスター・Admin配下モンスター問わず一律に適用され、味方同士の連携スキルの頻度も上昇します。

## 5. 管理者による制御とコスト

管理者システムにおいて、ミューテーターはダンジョン防衛の戦略的切り札として利用されます。

| 操作アクション | API エンドポイント | 必要コスト | 備考 |
| :--- | :--- | :--- | :--- |
| **ミューテーター手動発動** | `POST /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator` | 500 Gold, 魔晶石 ×2 | 600 ティック継続 |
| **ミューテーター強制消去** | `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator` | 100 Gold | 即時初期状態へリセット |
| **フロア変異一覧取得** | `GET /api/dungeon/{dungeonId}/floor/{floorLevel}/mutators` | なし (無料) | 現在アクティブな変異取得 |

## 6. データ構造と TypeScript 型定義

`src/@types/admin.d.ts` および `src/@types/player.d.ts` に定義されるデータモデル構造です。

```typescript
export interface DungeonMutatorEntry {
  mutatorId: string;           // ミューテーター固有ID (例: 'monster_frenzy')
  name: string;                // 表示名 (例: 'モンスター狂暴化')
  description: string;         // 効果の説明文
  type: 'buff' | 'debuff' | 'hazard' | 'special'; // 種別分類
  durationTicks: number;       // 持続時間（ティック数）
  activationCost: {
    gold: number;
    materials: { typeId: string; amount: number }[];
  };
}

export interface ActiveFloorMutator {
  mutatorId: string;           // 発動中のミューテーターID
  activatedBy: 'system' | 'admin'; // 発動主体
  activatedAt: number;         // 発動タイムスタンプ (UNIX ms)
  remainingTicks: number;      // 残り継続ティック数
}

export interface MutatorTriggerRequest {
  mutatorId: string;           // 起動するミューテーターID
}

export interface MutatorTriggerResult {
  success: boolean;            // 処理成否
  activeMutator?: ActiveFloorMutator; // 発動した変異データ
  consumedGold: number;        // 消費ゴールド
  consumedMaterials: { typeId: string; amount: number }[]; // 消費資材
  message: string;             // 結果メッセージ
}
```

## 7. REST API 仕様

### 7.1 ミューテーター手動起動
- **エンドポイント**: `POST /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator`
- **リクエスト**: `MutatorTriggerRequest`
- **レスポンス**: `MutatorTriggerResult`

### 7.2 アクティブミューテーター取得
- **エンドポイント**: `GET /api/dungeon/{dungeonId}/floor/{floorLevel}/mutators`
- **レスポンス**: `ActiveFloorMutator[]`

### 7.3 ミューテーター強制消去
- **エンドポイント**: `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/mutator`
- **レスポンス**: `{ success: boolean; message: string; }`

## 8. UI・UX 表示方針

- **HUD ウィジェット**: 画面上部の天候・時間表示の隣に「変異アイコン」を表示し、ホバーまたはタップで詳細効果と残り時間のツールチップを展開します。
- **ミニマップ**: ミューテーター適用中の階層ではミニマップ枠に専用のエフェクト（`blood_moon` は赤く点滅、`dense_fog_treasure` は霧モヤ演出）を付与します。
- **管理者パネル**: ダンジョン編集・フロア構築画面において、各階層の「変異発動ボタン」および消費コストプレビューを配置します。

## 9. 相互参照
- [バイオーム・環境システム](Biome-System.md)
- [昼夜・天候システム](Time-Weather-System.md)
- [ドロップ品・出現システム](Loot-and-Spawn-System.md)
- [PKシステム](PK-System.md)
- [派閥システム](Faction-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [実装詳細](../implementation/Implementation-Details.md)
