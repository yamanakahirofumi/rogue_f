# Altar-System

## 1. 概要
アルターシステム（Altar System / 祭壇システム）は、ダンジョン内に設置された古代の「祭壇（`altar`）」を巡り、探索者、管理者、およびPKer（乱入者）がそれぞれの役割に応じたインタラクションを行い、強力な効果（バフ・デバフ）やゲームプレイの分岐を生み出す仕組みです。
このシステムは、探索における「神への信仰・祈りと代償」、ダンジョン構築における「信仰による防衛力向上」、そしてPKにおける「禁忌（冒涜）による力と引き換えの絶対的リスク」という、三者三様の戦略的深みを提供します。

## 2. 四大神（Deities）の定義
祭壇には以下の4体の神のいずれかが祀られており、それぞれ得られる効果や特性が異なります。

### 2.1 闘神アレス (Ares)
- **司る領域**: 戦闘、力、物理攻撃。
- **特徴**: 物理的な戦闘能力を高めることに特化しています。

### 2.2 叡智神アテナ (Athena)
- **司る領域**: 叡智、戦略、防御、戦術。
- **特徴**: 防御力、回避率、命中率、トラップ発見能力などの戦術的優位性を司ります。

### 2.3 豊穣神デメテル (Demeter)
- **司る領域**: 農業、食料、生命力、自然回復。
- **特徴**: 満腹度の減少抑制、HP/STの自然回復、状態異常の治療を促します。

### 2.4 幸運神フォルトゥナ (Fortuna)
- **司る領域**: 運、富、アイテム発見。
- **特徴**: ゴールド獲得量、アイテムドロップ率、鑑定の成功やクリティカル率に影響を与えます。

---

## 3. 各役割におけるインタラクション

### 3.1 探索者（Explorer）の行動と効果
探索者はダンジョン内で発見した祭壇に対して、以下の行動をとることができます。

- **祈る (Pray)**:
  - 1フロアにつき1つの祭壇に対し、1回のみ実行可能です。
  - **効果**: 一定確率で神の「祝福（`DIVINE_BLESSING`）」を得ます。
  - **成功率**: プレイヤーの `運 (Luck)` に依存します。
    - `祈り成功率(%) = Math.min(95, 20 + プレイヤーの運 * 1.5)`
  - **失敗時**: 何も起こらないか、稀に少量のスタミナ（ST）を喪失します。

- **供物を捧げる (Offer)**:
  - 所持しているゴールド（G）またはアイテム（装備、食料、ポーション等）を祭壇に捧げます。
  - **効果**: 捧げたアイテムの価値（`value` や `tier`）またはゴールド額に応じて、神の「信仰度（`favorLevel`）」が上昇し、強力なバフ効果が確定で付与されます。
  - **必要ゴールド/価値目安**:
    - `favorLevel 1`（初期上昇）: 500G 相当
    - `favorLevel 5`（最大上昇）: 5,000G 相当
  - **恩恵（Deity-specific Blessings）**:
    - **アレス**: プレイヤーの攻撃力 +15%（持続100ターン）。
    - **アテナ**: プレイヤーの防御力 +20%、および命中率 +10%（持続100ターン）。
    - **デメテル**: 満腹度（Satiety）が 100% 回復し、満腹（SATIATED）状態を付与。さらに 200ターンの間、満腹度消費が半減（0.5倍）。
    - **フォルトゥナ**: 運（Luck）+10、およびクリティカル率 +15%（持続100ターン）。

### 3.2 管理者（Administrator）の設置と設定
管理者は、自身の「マイ・ダンジョン」を構築する際、設備として「祭壇（`altar`）」を任意の部屋に配置し、祀る神を設定できます。

- **設置・設定ルール**:
  - **設置コスト**: `魔力結晶 × 15`、`石材 × 10`、`5,000 ゴールド`（個人資金から支払）。
  - **容量消費**: 15 容量。
  - **神の設定**: 祭壇を配置した際、アレス、アテナ、デメテル、フォルトゥナのいずれかを選択して祀ります（再設定には 1,000 ゴールドが必要）。
- **配置メリット（フロア全体バフ）**:
  - 配置した祭壇が健全（未冒涜）な状態である限り、**その階層に配置されている防衛モンスター（管理者配下）に対し、フロア全体の常時バフ効果**が適用されます。
    - **アレスの祭壇**: 防衛モンスターの攻撃力 +10%。
    - **アテナの祭壇**: 防衛モンスターの防御力 +10%、および被クリティカル率半減。
    - **デメテルの祭壇**: 防衛モンスターのHP自然回復速度 1.5倍。
    - **フォルトゥナの祭壇**: 侵入者が防衛モンスターに倒された際のドロップアイテム・ゴールドの獲得効率 +15%。
- **神託・介入能力**:
  - [管理者介入システム](Admin-Intervention-System.md)と連携し、管理者が祭壇を介して「神託」を送信したり、信仰度（`favorLevel`）を消費して侵入者の頭上へ天罰（落雷や状態異常の付与）を落とすことが可能です。

### 3.3 侵入者・PKer（Invader）の禁忌とリスク
他者のマイ・ダンジョンに乱入するPKer（モンスター形態）は、祭壇に対して「邪悪な選択」をすることができます。

- **祭壇を冒涜・略奪する (Desecrate / Loot)**:
  - 祭壇に眠る神のエネルギーを汚染し、強制的に自己の力に還元します。
  - **効果（冒涜バフ）**:
    - 30ターンの間、PKerの全能力値（HP、ATK、DEF、SPD等）が **1.3倍** に強化される超強力なバフが付与されます。これにより、探索者（ターゲット）の撃破確率が飛躍的に高まります。
  - **絶対的代償（神罰 - `DIVINE_PUNISHMENT`）**:
    - 冒涜を実行した瞬間、祭壇は「汚染状態（`isDesecrated: true`）」となり、管理者へのフロア全体バフは即座に停止します。
    - 同時に、神の怒りによる「神罰（`DIVINE_PUNISHMENT`）」が**その階層全体**に発動します。
    - **神罰の効果**:
      - フロア内にいる「冒涜したPKer」は、移動するたびに 3 ダメージの必中スリップダメージ（神聖ダメージ）を受け、自然回復が完全に停止します。
      - さらに、祭壇の周囲に強力な「神罰の使徒（Lv10以上の光属性/無属性モンスター）」が 2〜3体 即座に召喚され、PKerを最優先で攻撃します。
      - この神罰は、PKerがそのフロアから帰還するか、死亡するまで**永続的**に解除されません。

---

## 4. 追加される状態異常

アルターシステムの実装に伴い、[状態異常システム](Status-Effect-System.md) に以下の2つの効果が新設されます。

| ID | 名称 | 種別 | 具体的な効果 |
| :--- | :--- | :--- | :--- |
| `DIVINE_BLESSING` | 神の祝福 | 強化 (Buff) | 全能力値 +10%、HP/ST自然回復量 +2。他のデバフ効果に対する耐性を 50% 向上。 |
| `DIVINE_PUNISHMENT` | 神罰 | 弱体化 (Debuff) | 自然回復が完全停止。行動（移動・攻撃・アイテム使用）ごとに最大HPの 1% のスリップダメージ。被ダメージが 1.2倍 に増加。 |

---

## 5. 技術データ構造

### 5.1 PlacedFacility（配置済み施設）への追加
`src/@types/admin.d.ts` の `PlacedFacility` インターフェースの `typeId` および `config` を拡張します。

```typescript
interface PlacedFacility {
  typeId: 'recovery_spring' | 'teleport_gate' | 'shop_counter' | 'synthesis_workshop' | 'torch' | 'statue' | 'altar';
  position: { x: number, y: number };
  config?: RecoverySpringConfig | TeleportGateConfig | StatueConfig | AltarConfig;
}
```

### 5.2 AltarConfig（祭壇詳細設定）インターフェース
```typescript
interface AltarConfig {
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna'; // 祀る神のID
  favorLevel: number;                                // 信仰度レベル (0〜5)
  isDesecrated: boolean;                             // 冒涜されているかフラグ
}
```

---

## 6. REST API 及びデータモデル仕様

祭壇のインタラクティブ操作、設置神の設定変更、解体・撤去、およびイベントログ記録は以下の REST API エンドポイントを介して実行されます。

### 6.1 祭壇インタラクティブ操作 API
探索者または PKer が祭壇に対して各種アクション（祈る、供物を捧げる、冒涜する、略奪する）を実行します。

- **エンドポイント**: `PUT /api/player/{userId}/command/altar/{action}`
- **パスパラメータ**:
  - `action`: `'pray' | 'offer-gold' | 'offer-item' | 'desecrate' | 'loot'`
- **リクエスト構造** (供物奉納時):
```typescript
interface AltarActionRequest {
  itemId?: string;     // 捧げるアイテムID (offer-item時)
  goldAmount?: number; // 捧げるゴールド額 (offer-gold時)
}
```
- **レスポンス構造**:
```typescript
interface AltarActionResult {
  result: 'divine_blessing' | 'divine_punishment' | 'favor_increased' | 'favor_decreased' | 'loot_success' | 'loot_failed_punished';
  grantedEffect?: string;        // 付与されたバフ/デバフ名 (DIVINE_BLESSING, DIVINE_PUNISHMENT 等)
  lootedItems?: InventoryItem[]; // 略奪成功時の獲得アイテム
  lootedGold?: number;          // 略奪成功時の獲得ゴールド
  favorLevel: number;           // 更新後の信仰度レベル (0〜5)
  message: string;              // 処理結果メッセージ
}
```

### 6.2 祭壇設定変更 API
管理者が配置済みの祭壇に対し、祀る神や信仰度パラメータを設定・変更します。

- **エンドポイント**: `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/altar`
- **リクエスト構造**:
```typescript
interface FacilityConfigUpdateRequest {
  floorLevel: number; // 設置階層レベル
  facilityId: string; // 施設ID
  config: AltarConfig; // 更新する祭壇構成
}

interface AltarConfig {
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna'; // 祀る神のID
  favorLevel: number;                                // 信仰度レベル (0〜5)
  isDesecrated: boolean;                             // 冒涜されているかフラグ
}
```
- **レスポンス構造**:
```typescript
interface FacilityConfigUpdateResult {
  success: boolean;                 // 設定更新の成否
  updatedFacility?: PlacedFacility; // 更新後の設置施設データ
  message: string;                  // 処理結果メッセージ
}
```

### 6.3 祭壇撤去・解体 API
配置済みの祭壇をダンジョンから撤去・解体し、設置コストの 50%（端数切り捨て）にあたる資材・ゴールドを管理者のストックに回収します。

- **エンドポイント**: `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/facility/{facilityId}`
- **リクエスト構造**:
```typescript
interface FacilityDismantleRequest {
  floorLevel: number;                 // 解体対象の階層番号
  facilityId?: string;                // 解体対象の施設ID
  position: { x: number; y: number }; // 解体対象の施設座標
}
```
- **レスポンス構造**:
```typescript
interface FacilityDismantleResult {
  success: boolean;                   // 撤去・解体処理の成否
  recoveredGold: number;              // 回収されたゴールド (5,000ゴールドの50% = 2,500ゴールド)
  recoveredMaterials: { typeId: string; amount: number }[]; // 回収された資材 (魔力結晶×7, 石材×5)
  message: string;                    // 処理結果メッセージ
}
```

### 6.4 イベントログ仕様 (`altar_interaction`)
祭壇に対する各種操作（祈り、供物、冒涜、略奪、神罰発動）時に発行される `DungeonEvent` の詳細構造です。

```typescript
interface AltarInteractionDetails {
  action: 'pray' | 'offer' | 'desecrate' | 'loot' | 'divine_punishment'; // アクション種別
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna';                     // 対象の神ID
  favorLevel: number;                                                   // アクション後の信仰度
  resultEffect?: string;                                                // 付与・発動された効果名
}
```

---

## 7. 相互参照
- [機能仕様書](Functional-Specification.md)
- [建築システム](Construction-System.md)
- [彫像システム (Statue-System.md)](Statue-System.md)
- [状態異常システム](Status-Effect-System.md)
- [管理者介入システム](Admin-Intervention-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [Player型定義](../../src/@types/player.d.ts)
