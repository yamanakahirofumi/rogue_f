# モンスター図鑑システム (Monster Bestiary System)

## 1. 概要
モンスター図鑑・研究システム（Monster Bestiary & Research System）は、探索者がダンジョン内で遭遇・討伐・捕獲した野生モンスター、および拠点やマイ・ダンジョンで飼育・繁殖させたモンスターのデータを記録・分析・研究するための仕組みです。

プレイヤーはモンスターとの戦闘や所有、育成を通じて対象種別の「研究レベル（Research Level）」を上昇させ、基本ステータスやドロップ品、スキル、AIパターンなどの詳細情報を開示させると同時に、該当モンスターに対する与ダメージ補正や捕獲成功率上昇、繁殖時の孵化時間短縮といった実用的なボーナス（バフ）を獲得します。

---

## 2. 研究レベルと解放要素

研究レベルは **Level 0** から **Level 3** までの 4 段階で構成されており、プレイヤーの行動（遭遇・撃破・捕獲・繁殖）に応じて経験・研究度が加算されレベルアップします。

### 2.1 レベル別解放基準

| 研究レベル | 名称 | 主な解放条件 | 開示される情報 |
| :--- | :--- | :--- | :--- |
| **Level 0** | 未遭遇 / 未認知 | モンスターと未遭遇の状態。 | シルエット表示のみ。名称やステータスは「???」と表記。 |
| **Level 1** | 認知・基本解析 | 対象モンスターと 1 回以上遭遇、または 1 体撃破 / 捕獲。 | モンスター名、属性、おおよその基本ステータス（HP・攻撃力の目安）。 |
| **Level 2** | 詳細解析 | 対象モンスターを累計 **10 体** 撃破・捕獲、または 1 体以上所有・繁殖。 | 完全なステータス数値（HP、ST、ATK、DEF、AGI、DEX、SPD、LUK）、所持スキル。 |
| **Level 3** | 完全解析 | 対象モンスターを累計 **30 体** 撃破・捕獲、または累計 **1 回以上** 繁殖（孵化）達成。 | ドロップアイテム一覧（ドロップ率）、所持可能特性リスト、AIパターン（行動傾向）。 |

---

## 3. 研究レベル別効果・ボーナス一覧

図鑑の研究レベルが上昇すると、探索（戦闘・捕獲）および育成（繁殖）の両面で永続的なボーナスが該当モンスター種別に対して適用されます。

### 3.1 探索・戦闘・捕獲ボーナス

| 研究レベル | 与ダメージ補正 | 捕獲成功率補正 | 繁殖（孵化）時間補正 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| **Level 0** | 1.00 倍 (+0%) | 1.00 倍 (+0%) | 変化なし | 初期状態。 |
| **Level 1** | **1.01 倍 (+1%)** | 1.00 倍 (+0%) | 変化なし | 弱点を把握し微小なダメージ増加。 |
| **Level 2** | **1.03 倍 (+3%)** | **1.02 倍 (+2%)** | 変化なし | 行動パターンを解明し捕獲のコツを掴む。 |
| **Level 3** | **1.05 倍 (+5%)** | **1.05 倍 (+5%)** | **10% 短縮 (0.90倍)** | 完全解析により弱点特攻・捕獲最適化・育成効率化が発動。 |

※ **与ダメージ補正**: [戦闘システム](Combat-System.md) における最終ダメージ計算時に乗算補正として適用されます。
※ **捕獲成功率補正**: [モンスターシステム](Monster-System.md) のキャプチャーボール使用時の成功率判定に加算補正として適用されます。
※ **孵化時間短縮**: [モンスター繁殖システム](Monster-Breeding-System.md) において、該当モンスターの卵を孵化器にセットした際の総所要時間が 10% 削減されます。

---

## 4. UI・UX 仕様

### 4.1 図鑑画面 (Bestiary Panel)
プレイヤーは拠点（Base）またはダンジョン内のメニュー画面から「モンスター図鑑 (Bestiary)」を開くことができます。

- **フィルター・ソート機能**:
  - 種別（スライム系、ゴブリン系、ドラゴン系等）
  - 属性（Fire, Water, Wood, Light, Dark, None）
  - 研究レベル（Level 0 〜 3）
  - 図鑑番号順 / 研究進捗順
- **モンスター詳細プレビュー**:
  - 中央に 3D/スプライト プレビューを表示（Level 0 の場合はシルエット表記）。
  - 右側に研究レベル、遭遇数・撃破数・捕獲数・孵化数のスタッツを表示。
  - 研究レベルに応じたタブ（ステータス、スキル、ドロップ品、特性・AI）を切り替えて情報を確認可能。

---

## 5. REST API エンドポイント仕様 (REST API Specifications)

モンスター図鑑情報の参照、詳細解析データの確認、および戦闘・捕獲・繁殖時の研究度進捗処理を行うための API エンドポイントです。詳細は **[実装詳細](../implementation/Implementation-Details.md)** を参照してください。

### 5.1 全図鑑概要一覧の取得
- **エンドポイント**: `GET /api/player/{userId}/bestiary`
- **説明**: プレイヤーが遭遇・解析した全モンスター種別の研究進捗概要リストを取得します。
- **レスポンス**: `BestiaryEntry[]`

### 5.2 特定モンスターの詳細解析データ取得
- **エンドポイント**: `GET /api/player/{userId}/bestiary/{monsterTypeId}`
- **説明**: 指定したモンスター種別の研究レベルに応じた詳細解析データ（ステータス、スキル、ドロップアイテム、特性、AIパターン）を取得します。
- **レスポンス**: `BestiaryMonsterDetail`

---

## 6. 技術データ構造 (Technical Data Structures)

### 6.1 Player データモデルの拡張
プレイヤーの図鑑保持状態および研究進捗を管理するため、**[Playerデータモデル](../../src/@types/player.d.ts)** 内にプロパティを追加します。

```typescript
// Player クラス / インターフェースに追加されるプロパティ
bestiary?: BestiaryEntry[]; // モンスター図鑑のエントリーリスト
```

### 6.2 BestiaryEntry インターフェース
各モンスター種別の研究進捗および統計データを保持するデータ構造です。

```typescript
interface BestiaryEntry {
  monsterTypeId: string;      // モンスター種別ID (例: 'slime', 'goblin', 'fire_dragon')
  researchLevel: 0 | 1 | 2 | 3; // 現在の研究レベル
  encounterCount: number;     // 遭遇回数
  defeatCount: number;        // 撃破回数
  captureCount: number;       // 捕獲回数
  breedCount: number;         // 孵化（繁殖）回数
  unlockedAt?: Date;          // 最初に Level 1 に到達した日時
}
```

### 6.3 BestiaryMonsterDetail インターフェース
研究レベルに応じて開示されるモンスターの完全解析データ構造です。

```typescript
interface BestiaryMonsterDetail {
  monsterTypeId: string;      // モンスター種別ID
  name: string;               // モンスター名 (Level 0 は '???')
  researchLevel: 0 | 1 | 2 | 3; // 現在の研究レベル
  attribute?: string;         // 属性 (Level 1 以上で公開)
  encounterCount: number;     // 遭遇回数
  defeatCount: number;        // 撃破回数
  captureCount: number;       // 捕獲回数
  breedCount: number;         // 孵化数
  stats?: {                   // 完全ステータス (Level 2 以上で公開)
    hp: number;
    stamina?: number;
    attack: number;
    defense: number;
    agility: number;
    dexterity: number;
    speed: number;
    luck: number;
  };
  skills?: {                  // 所持スキルリスト (Level 2 以上で公開)
    id: string;
    name: string;
    description: string;
  }[];
  possibleDrops?: {           // ドロップ可能アイテム一覧 (Level 3 で公開)
    itemTypeId: string;
    itemName: string;
    dropRatePercent: number;  // ドロップ率 (%)
  }[];
  possibleTraits?: string[];  // 所持可能特性IDリスト (Level 3 で公開)
  aiPatternDescription?: string; // AIパターンの詳細解説 (Level 3 で公開)
  bonuses: {                  // 現在適用されている研究ボーナス
    damageMultiplier: number;  // 与ダメージ倍率 (1.00〜1.05)
    captureRateBonus: number;  // 捕獲率加算補正 (+0%〜+5%)
    hatchTimeReductionRatio: number; // 孵化時間短縮比率 (0.00 または 0.10)
  };
}
```

### 6.4 BestiaryProgressResult インターフェース
撃破・捕獲・繁殖等のアクション実行時に研究進捗が加算され、研究レベルがランクアップした際に返却される処理結果構造です。

```typescript
interface BestiaryProgressResult {
  monsterTypeId: string;      // モンスター種別ID
  updatedEntry: BestiaryEntry; // 更新後の図鑑エントリー
  oldResearchLevel: 0 | 1 | 2 | 3; // 変更前の研究レベル
  newResearchLevel: 0 | 1 | 2 | 3; // 変更後の研究レベル
  isLevelUp: boolean;          // 研究レベルが昇格したか
  newlyUnlockedBonuses?: {     // 新たに解放されたボーナス
    damageMultiplier?: number;
    captureRateBonus?: number;
    hatchTimeReductionRatio?: number;
  };
  message: string;             // 処理結果メッセージ
}
```

---

## 7. 他システムとの動的連携

- **[戦闘システム](Combat-System.md)**: プレイヤーがモンスターに攻撃を行う際、攻撃対象の `typeId` に対応する図鑑の研究レベルを参照し、与ダメージ（+1% 〜 +5%）を自動計算します。
- **[モンスターシステム](Monster-System.md)**: モンスター撃破時やキャプチャーボール成功時に、`defeatCount` や `captureCount` をインクリメントし、条件を満たした場合に `researchLevel` を即座に昇格させます。
- **[モンスター繁殖システム](Monster-Breeding-System.md)**: 卵の孵化開始処理において、親モンスターの `typeId`（または誕生する卵の `typeId`）の研究レベルが Level 3 の場合、孵化に必要な総時間 (`hatchTimeTotal`) に 0.9 を乗算します。
- **[称号・実績システム](Title-System.md)**: 一定数以上のモンスターで Level 3（完全解析）を達成した際に、「モンスター博士 (`monster_scholar`)」などの特別な称号が解放されます。

---

## 8. 相互参照
- [モンスターシステム](Monster-System.md)
- [モンスターマスターリスト](Monster-Master-List.md)
- [モンスター繁殖システム](Monster-Breeding-System.md)
- [戦闘システム](Combat-System.md)
- [称号・実績システム](Title-System.md)
- [Player型定義](../../src/@types/player.d.ts)
