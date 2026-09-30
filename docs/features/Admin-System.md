# Admin-System

## 1. 概要
管理者システムは、RogueF における「構築と運営」の側面を担う中核的な機能です。管理者は自身の支配する世界（サーバー）において、ダンジョンの作成、モンスターやトラップの配置、経済のコントロール（ショップ運営）、および他のサーバーとの連携管理を行うことができます。

## 2. ダンジョン管理

### 2.1 ダンジョン作成と階層設定
- 管理者は新しいダンジョンを任意の名前で作成できます。
- **デスペナルティ設定**: 階層ごとに、またはダンジョン全体に対して、プレイヤー死亡時のアイテム・ゴールド没収ルールを設定できます。詳細は [機能仕様書](Functional-Specification.md#4-デスペナルティの設定) を参照してください。
- **クリア報酬設定**: ダンジョンをクリアしたプレイヤーに与える報酬（ゴールド、アイテム）を設定します。報酬は管理者の資産から差し引かれます。

### 2.2 フィールド構築
- **リアルタイム配置**: 管理者は攻略中のプレイヤーに対し、リアルタイムにモンスターやトラップを配置・召喚して干渉することができます。詳細は **[管理者介入システム](Admin-Intervention-System.md)** を参照してください。
- **施設設置**: ダンジョン内にショップや回復施設を恒常的に設置・管理できます。

## 3. モンスター・トラップの配置

### 3.1 モンスター配置
- [倉庫システム](Warehouse-System.md) から飼育済みのモンスターを選択し、ダンジョン内の任意の座標に配置します。
- **AI設定**: 配置したモンスターに特定の思考ルーチン（積極的、遠距離型など）を割り当てます。詳細は [戦闘システム](Combat-System.md#3-モンスターAIパターン) を参照してください。

### 3.2 トラップ配置
- 収集した資材を消費して、隠れた罠を配置します。
- トラップの種類と効果については [トラップシステム](Trap-System.md) を参照してください。

## 4. ショップ経営

### 4.1 在庫管理と商品選定
- [倉庫システム](Warehouse-System.md) に保管されているアイテムを、管理画面からショップの陳列スロットへ登録します。

### 4.2 動的価格設定
- **基本市場価格の参照**: 世界内の流通量に基づいた基本価格を確認します。
- **リアルタイム価格変更**: 管理者は戦略に応じて、販売価格をリアルタイムで変更可能です。詳細は [ショップシステム](Shop-System.md) を参照してください。

## 5. 世界設定とトラストネットワーク

### 5.1 サーバー間連携 (Trust Network)
- 他の管理者が運営するサーバーとの間に「信頼関係」を構築します。
- **信頼ポリシーの設定**: 接続先サーバーごとに、以下のポリシーを個別に管理します。
    - **アイテム持ち込み制限**: 双方向、片方向、または移動不可の設定。
    - **レベル同期設定**: 共有、引き継ぎ、またはリセットの設定。
- 詳細は [機能仕様書](Functional-Specification.md#8-世界間連携とトラストネットワーク) を参照してください。

### 5.2 世界内ルール
- PVP（プレイヤー対プレイヤー）の有効・無効、PKの許可レベルなど、世界全体に適用される基本ルールを設定します。

## 6. ダンジョン監視とログ (Monitoring & Logs)
管理者は、自身の運営するダンジョン内での出来事をリアルタイムで監視し、過去のログを振り返ることができます。

### 6.1 リアルタイムモニタリング
- 現在攻略中のプレイヤーの座標、HP、所持アイテムなどの情報を一覧で確認できます。
- モンスターの生存状況やトラップの発動状況をマップ上で視覚的に把握できます。

### 6.2 イベントログ (Dungeon Events)
- 以下の主要なイベントがログとして記録され、管理画面から閲覧可能です。
    - **プレイヤーの行動**: 入場、脱出、死亡、重要アイテムの取得、階段の利用。
    - **戦闘**: モンスターの撃破、プレイヤーの被ダメージ。
    - **トラップ**: トラップの発見、発動、解除。
    - **管理者介入**: モンスター召喚、特殊効果の発動履歴。

### 6.3 管理者アクションログ (Admin Action Logs)
- 管理者自身が行った設定変更（価格改定、ポリシー更新、建築操作）の履歴を管理します。
- これにより、自身の戦略がどのように経済や攻略状況に影響を与えたかを分析できます。

## 7. 管理者 UI (Admin UI)
管理画面（`/admin`）の具体的な画面構成、操作方法、およびデザイン方針については、**[UI・UX設計](UI-UX-Design.md#4-管理者用-ui-admin-ui)** を参照してください。

## 8. 管理者 REST API 仕様およびデータモデル (Admin REST API & Data Models)

管理者が世界を構築・運営するための全エンドポイント、型定義、およびデータモデルリファレンスです。

### 8.1 REST API エンドポイント一覧

#### ダンジョン・階層管理 API
- `POST /api/admin/dungeon`: 新規ダンジョンの作成。
  - リクエスト: `DungeonConfig` (idはサーバー自動生成)
  - レスポンス: `DungeonConfig`
- `GET /api/admin/dungeons`: 管理者が所有する全ダンジョン設定一覧の取得。
  - レスポンス: `DungeonConfig[]`
- `PUT /api/admin/dungeon/{dungeonId}/floor/{floorLevel}`: 特定階層の構成（地形、モンスター・トラップ・施設・ショップ配置）の更新。
  - リクエスト: `FloorConfig`
  - レスポンス: `FloorConfig`
- `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/trap`: 配置済みトラップの撤去・解体（設置コストの 50% 資材・ゴールドを回収）。
  - リクエスト: `TrapDismantleRequest`
  - レスポンス: `TrapDismantleResult`
- `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/terrain`: 特殊地形の撤去・解体と標準床へのリセット（設置コストの 50% 資材・ゴールドを回収）。
  - リクエスト: `TerrainDismantleRequest`
  - レスポンス: `TerrainDismantleResult`
- `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/facility/{facilityId}`: 配置済み施設の撤去・解体（設置コストの 50% 資材・ゴールドを回収）。
  - リクエスト: `FacilityDismantleRequest`
  - レスポンス: `FacilityDismantleResult`
- `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/monster/{monsterId}`: 配置済みモンスターの撤去・回収（倉庫ステータスを 'placed' から 'idle' へ更新・配置容量解放）。
  - リクエスト: `MonsterRecallRequest`
  - レスポンス: `MonsterRecallResult`
- `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/shop/{shopId}`: 設置済みショップの閉鎖・撤去（陳列中の未売却商品を倉庫へ返還・配置容量解放）。
  - リクエスト: `ShopCloseRequest`
  - レスポンス: `ShopCloseResult`

#### 倉庫・リソース管理 API
- `GET /api/admin/warehouse`: 倉庫の状態（モンスター、アイテム、資材、容量）の取得。
  - レスポンス: `WarehouseState`
- `POST /api/admin/warehouse/expand`: 倉庫の保管枠（モンスター/アイテム/資材）の拡張。
  - リクエスト: `WarehouseExpandRequest`
  - レスポンス: `WarehouseExpandResult`
- `POST /api/admin/warehouse/item/deposit`: プレイヤー所持品または報酬からの倉庫へのアイテム預入。
  - リクエスト: `WarehouseItemDepositRequest`
  - レスポンス: `WarehouseItemDepositResult`
- `POST /api/admin/warehouse/item/withdraw`: 倉庫からプレイヤーインベントリへのアイテム引出。
  - リクエスト: `WarehouseItemWithdrawRequest`
  - レスポンス: `WarehouseItemWithdrawResult`
- `POST /api/admin/warehouse/monster/status`: 保管中モンスターの稼働状態（`idle`, `placed`, `expedition`）の更新。
  - リクエスト: `WarehouseMonsterStatusRequest`
  - レスポンス: `WarehouseMonsterStatusResult`
- `POST /api/admin/warehouse/monster/breed`: モンスター同士の繁殖試行。
  - リクエスト: `MonsterBreedRequest`
  - レスポンス: `MonsterBreedResult`
- `POST /api/admin/warehouse/monster/{eggId}/hatch`: 孵化準備完了卵の即時孵化実行。
  - リクエスト: `MonsterHatchRequest`
  - レスポンス: `MonsterHatchResult`
- `POST /api/admin/warehouse/monster/{eggId}/accelerate`: 孵化促進剤の使用による孵化時間短縮・即時完了。
  - リクエスト: `MonsterAccelerateRequest`
  - レスポンス: `MonsterAccelerateResult`

#### 施設設定管理 API
- `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/statue`: 配置済み彫像の特殊効果（畏怖/守護/癒やし/強欲/輝き）変更。
  - リクエスト: `FacilityConfigUpdateRequest` (config: `StatueConfig`)
  - レスポンス: `FacilityConfigUpdateResult`
- `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/altar`: 配置済み祭壇の祀る神・初期信仰度変更。
  - リクエスト: `FacilityConfigUpdateRequest` (config: `AltarConfig`)
  - レスポンス: `FacilityConfigUpdateResult`
- `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/fishing`: 配置済み釣り堀の構成（利用料・エサ制限）変更。
  - リクエスト: `FacilityConfigUpdateRequest` (config: `FishingPointConfig`)
  - レスポンス: `FacilityConfigUpdateResult`

#### モンスター遠征 API
- `GET /api/admin/expedition/destinations`: 派遣可能な遠征目的地一覧の取得。
  - レスポンス: `ExpeditionDestination[]`
- `GET /api/admin/expeditions`: 現在派遣中の遠征隊一覧の取得。
  - レスポンス: `ExpeditionState[]`
- `POST /api/admin/expedition/dispatch`: 遠征隊の派遣開始。
  - リクエスト: `ExpeditionDispatchRequest`
  - レスポンス: `ExpeditionDispatchResult`
- `POST /api/admin/expedition/{expeditionId}/claim`: 完了した遠征の報酬受取およびモンスターの帰還。
  - レスポンス: `ExpeditionClaimResult`

#### ショップ管理 API
- `POST /api/admin/shop`: ダンジョン内にショップを新規設置。
  - リクエスト: `ShopCreateRequest`
  - レスポンス: `ShopCreateResult`
- `PUT /api/admin/shop/{shopId}/slots`: ショップの陳列商品と価格スロットを更新。
  - リクエスト: `ShopSlotsUpdateRequest`
  - レスポンス: `ShopSlotsUpdateResult`

#### トラストネットワーク (世界間連携) API
- `GET /api/admin/trust-network`: 信頼関係にあるサーバー一覧の取得。
  - レスポンス: `TrustedServer[]`
- `POST /api/admin/trust-network/server`: 新しいサーバーとの信頼関係構築申請。
  - リクエスト: `TrustServerAddRequest`
  - レスポンス: `TrustServerAddResult`
- `PUT /api/admin/trust-network/server/{serverId}`: 信頼ポリシー（アイテム移動・レベル同期）の更新。
  - リクエスト: `TrustPolicyUpdateRequest`
  - レスポンス: `TrustPolicyUpdateResult`

#### ゲームバランス管理 API
- `GET /api/admin/balance`: 動的ゲームバランスパラメーターの取得。
  - レスポンス: `BalanceConfig`
- `PUT /api/admin/balance`: 動的ゲームバランスパラメーターのリアルタイム更新。
  - リクエスト: `Partial<BalanceConfig>`
  - レスポンス: `BalanceConfig`
- `GET /api/admin/balance/telemetry`: 収集されたバランステレメトリデータの取得。
  - レスポンス: `BalanceTelemetry`

#### リアルタイム介入 API
- `POST /api/admin/intervention/player/{userId}/summon`: 攻略中のプレイヤーと同じマップ座標へ手持ちモンスターを即座に召喚。
  - リクエスト: `AdminSummonRequest`
  - レスポンス: `AdminSummonResult`
- `POST /api/admin/intervention/player/{userId}/trigger`: 指定座標のトラップ強制作動または環境効果（落雷・落石・ガス漏れ・地震）を発生。
  - リクエスト: `AdminTriggerRequest`
  - レスポンス: `AdminTriggerResult`

#### モニタリング & ログ API
- `GET /api/admin/logs/dungeon/{dungeonId}`: 指定ダンジョンのイベントログを取得。
  - クエリパラメータ: `limit`, `offset`, `type`
  - レスポンス: `DungeonEvent[]`
- `GET /api/admin/logs/actions`: 管理者の操作アクションログを取得。
  - クエリパラメータ: `limit`, `offset`, `action`
  - レスポンス: `AdminLog[]`

### 8.2 主要データモデルリファレンス

TypeScript 型定義 (`src/@types/admin.d.ts` で定義):

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
  rewards: ClearRewardConfig;       // クリア報酬設定
  rewardPool: ClearRewardPool;      // 現在の報酬プール残高
}

interface FloorConfig {
  floorLevel: number;      // 階層番号
  width: number;           // マップ幅
  height: number;          // マップ高さ
  biomeId: 'cave' | 'forest' | 'ice' | 'lava'; // 現在の階層のバイオームID
  tiles: string[][];       // 地形データ (2次元配列)
  monsters: PlacedMonster[]; // 配置済みモンスター
  traps: PlacedTrap[];       // 配置済みトラップ
  shops: PlacedShop[];       // 設置済みショップ
  facilities: PlacedFacility[]; // 設置済み施設
}

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

interface AdminLog {
  id: string;              // ログ固有ID
  timestamp: number;       // 操作時刻
  adminId: string;         // 管理者のユーザーID
  action: AdminActionType; // 操作種別
  targetId?: string;       // 対象のID (dungeonId, shopId等)
  changes: {
    before: any;           // 変更前
    after: any;            // 変更後
  };
}

type AdminActionType =
  | 'create_dungeon'       // ダンジョン作成
  | 'update_floor'         // 階層更新
  | 'update_shop_price'    // ショップ価格更新
  | 'update_trust_policy'  // 信頼ポリシー更新
  | 'intervene_player';    // プレイヤーへの介入
```

## 9. 相互参照
- [機能仕様書](Functional-Specification.md)
- [管理者介入システム](Admin-Intervention-System.md)
- [ショップシステム](Shop-System.md)
- [倉庫システム](Warehouse-System.md)
- [トラップシステム](Trap-System.md)
- [モンスターシステム](Monster-System.md)
- [UI・UX設計](UI-UX-Design.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
