# Implementation-Details

## 1. クラス設計とロジックの概要
詳細は [アーキテクチャ設計](../tech/Architecture.md) を参照してください。

## 2. APIリファレンス

### 2.1 ユーザー管理
- `GET /api/user/name/{name}/exist`: ユーザー名の存在確認。
  - レスポンス: `boolean`
- `POST /api/user/name/{name}`: ユーザー作成。
  - レスポンス: `string` (作成されたユーザーのID)

### 2.2 プレイヤー情報
- `GET /api/player/{userId}`: プレイヤー情報の取得。
  - レスポンス: `Player`
- `PUT /api/player/{userId}/command/{command}`: 移動やアクションのコマンド送信。
  - 基本コマンド: `top`, `down`, `right`, `left`, `top-right`, `top-left`, `down-right`, `down-left`, `pickup`, `downStairs`, `upStairs`, `wait`
    - `upStairs` (1Fにて): ダンジョンから脱出。
    - `downStairs` (最終階層にて): ダンジョンをクリア。
  - 探索・解除コマンド:
    - `search`: 周囲のトラップや隠し通路を探索。
      - レスポンス: `SearchResult`
    - `disarm`: 足元のトラップの解除を試行。
    - `disarm/{direction}`: 指定した方向（`top`, `down`, `right`, `left`）に隣接するトラップの解除を試行。
      - レスポンス: `DisarmResult`
  - アクションコマンド:
    - `attack`: 隣接する敵に攻撃を実行。
    - `attack/{targetId}`: 指定したIDの対象に攻撃を実行（遠距離攻撃等）。
    - `use/{itemId}`: アイテムを使用。
    - `use/{itemId}/{targetId}`: 指定した対象にアイテムを使用。
    - `equip/{itemId}`: アイテムを装備。
    - `unequip/{itemId}`: 装備を解除。
    - `drop/{itemId}`: アイテムを足元に置く。
    - `skill/{actionId}`: 特殊行動（スキル）を実行。
    - `skill/{actionId}/{targetId}`: 指定した対象に特殊行動を実行。
    - `throw/{itemId}/{direction}`: 指定した方向にアイテムを投げる。
    - `throw/{itemId}/{targetId}`: 指定した対象にアイテムを投げる。
  - ショップコマンド:
    - `buy/{itemId}`: ショップの商品を購入。
    - `sell/{itemId}`: インベントリのアイテムを売却。
    - `appraise/{itemId}`: ショップでアイテムを鑑定（鑑定料が必要）。
  - インベントリ管理コマンド:
    - `PUT /api/player/{userId}/inventory/sort`: 定義されたソート階層または基準に従いインベントリを自動整列・スタック統合。
      - リクエスト: `InventorySortRequest`
      - レスポンス: `InventoryItem[]`
    - `PUT /api/player/{userId}/inventory/swap`: インベントリ内の 2 つのスロット位置を入れ替え。
      - リクエスト: `InventorySwapRequest`
      - レスポンス: `InventoryItem[]`
  - コミュニケーションコマンド:
    - `PUT /api/player/{userId}/emote/{emoteId}`: エモートまたはスタンプを送信。
  - 宝箱インタラクティブコマンド:
    - `PUT /api/player/{userId}/command/chest/unlock-hand`: 手で開ける（ピッキング試行）。
      - レスポンス: `ChestOpenResult`
    - `PUT /api/player/{userId}/command/chest/unlock-key/{itemId}`: 鍵を消費して安全に開錠。
      - レスポンス: `ChestOpenResult`
    - `PUT /api/player/{userId}/command/chest/smash`: 武器で宝箱を強打して破壊開錠。
      - レスポンス: `ChestOpenResult`
    - `PUT /api/player/{userId}/command/chest/inspect`: 宝箱を観察・見破り（ミミック判別・罠検査）。
      - レスポンス: `{ isMimic: boolean; isTrapped: boolean; message: string }`
  - 釣りインタラクティブコマンド:
    - `PUT /api/player/{userId}/command/fish/cast`: 釣りのキャストを実行。
      - リクエスト: `{ rodItemId: string; baitItemId?: string }`
      - レスポンス: `FishCastResult`
    - `PUT /api/player/{userId}/command/fish/hook`: フッキング（タイミング合わせ）を実行。
      - リクエスト: `{ timingAccuracy: 'perfect' | 'success' | 'failed' }`
      - レスポンス: `FishingHookResult`
  - 祭壇インタラクティブコマンド:
    - `PUT /api/player/{userId}/command/altar/{action}`: 祭壇との相互作用を実行。
      - `action`: `pray`, `offer-gold`, `offer-item`, `desecrate`, `loot`
      - リクエスト (offer時): `{ itemId?: string; goldAmount?: number }`
      - レスポンス: `AltarActionResult`
  - クエスト管理エンドポイント:
    - `GET /api/player/{userId}/quests`: 進行中および達成状況クエストの取得。
      - レスポンス: `PlayerQuestProgress[]`
    - `POST /api/player/{userId}/quest/{questId}/claim`: 完了したクエストの報酬受取。
      - レスポンス: `QuestClaimResult`
  - 称号管理エンドポイント:
    - `GET /api/player/{userId}/titles`: 獲得済み・未解放の称号一覧取得。
      - レスポンス: `TitleEntry[]`
    - `PUT /api/player/{userId}/title/equip/{titleId}`: 称号をアクティブ装備。
      - レスポンス: `boolean`
    - `PUT /api/player/{userId}/title/unequip`: 装備中の称号を外す。
      - レスポンス: `boolean`
  - モンスター図鑑エンドポイント:
    - `GET /api/player/{userId}/bestiary`: 解析データ一覧の取得。
      - レスポンス: `BestiaryEntry[]`
  - オーディオ設定エンドポイント:
    - `PUT /api/player/{userId}/audio-settings`: 音量設定（マスター・BGM・SE）の更新。
      - リクエスト: `AudioSettings`
      - レスポンス: `boolean`
  - ロア・世界観情報エンドポイント:
    - `GET /api/player/{userId}/lore`: 解放状況を含む全ロアエントリー一覧の取得。
      - レスポンス: `LoreEntry[]`
    - `GET /api/player/{userId}/lore/{loreId}`: 指定したロアの詳細本文の取得。
      - レスポンス: `LoreEntry`
    - `POST /api/player/{userId}/lore/unlock`: （特定イベント達成時等の）ロア解禁リクエスト。
      - リクエスト: `LoreUnlockRequest`
      - レスポンス: `LoreUnlockResult`
  - NPC会話制御エンドポイント:
    - `GET /api/player/{userId}/npc/{npcId}/dialogue`: プレイヤーの現在状況（レベル、到達階層、解禁済みLore、装備称号）に応じた動的セリフの取得。
      - レスポンス: `NpcDialogue`
  - 郵便受け・プレゼント管理エンドポイント:
    - `GET /api/player/{userId}/mail`: 保管中のメール一覧の取得。
      - レスポンス: `MailMessage[]`
    - `POST /api/player/{userId}/mail/{mailId}/claim`: 指定したメールの添付品受取。
      - レスポンス: `MailClaimResult`
    - `POST /api/player/{userId}/mail/claim-all`: 全ての未受取メールの添付品一括受取。
      - レスポンス: `{ claimedCount: number; rewards: MailAttachment; message: string }`
    - `DELETE /api/player/{userId}/mail/{mailId}`: 指定したメールの個別削除。
      - レスポンス: `boolean`
    - `DELETE /api/player/{userId}/mail/clear-read`: 既読・受取済みメールの一括削除。
      - レスポンス: `{ deletedCount: number }`
  - レスポンス (上記移動/一般コマンド): `{ [name: string]: boolean }`
  - レスポンス (pickup): `PickUpResult`
  - レスポンス (search): `SearchResult`
  - レスポンス (disarm): `DisarmResult`
  - レスポンス (attack): `CombatResult`
  - レスポンス (buy): `BuyResult`
  - レスポンス (sell): `SellResult`
  - レスポンス (appraise): `AppraiseResult`
  - レスポンス (1FのupStairs / 最終階のdownStairs): `DungeonExitResult`

### 2.3 フィールド・ダンジョン
- `GET /api/fields/{userId}/now`: フィールドの現在の状態取得。
  - レスポンス: `DisplayData[]`
- `GET /api/fields/{userId}/info`: ダンジョン情報の取得。
  - レスポンス: `DungeonInfo`
- `POST /api/player/{userId}/command/dungeon/default`: ダンジョンへの入場。
- `GET /api/fields/{userId}` (SSE): フィールドのリアルタイム更新。
  - ストリーム要素: `DisplayData`

### 2.4 管理者向けデータ
- 管理者がダンジョンや倉庫を運営するためのデータ構造については、以下のドキュメントを参照してください。
  - **[管理者データモデル](Admin-Data-Models.md)**: ダンジョン設定、階層配置、ショップ運営、および倉庫の状態管理。

### 2.5 管理者向け API (Admin API)
管理者が世界を構築・運営するためのエンドポイントです。

- **ダンジョン管理**
  - `POST /api/admin/dungeon`: 新規ダンジョンの作成。
    - リクエスト: `DungeonConfig` (idはサーバー生成)
  - `GET /api/admin/dungeons`: 管理者が所有するダンジョン一覧の取得。
    - レスポンス: `DungeonConfig[]`
  - `PUT /api/admin/dungeon/{dungeonId}/floor/{floorLevel}`: 特定階層の構成（マップ、配置物）の更新。
    - リクエスト: `FloorConfig`
- **倉庫・リソース管理**
  - `GET /api/admin/warehouse`: 倉庫の状態（モンスター、アイテム、資材）を取得。
    - レスポンス: `WarehouseState`
  - `POST /api/admin/warehouse/expand`: 倉庫の保管枠（モンスター/アイテム/資材）を拡張。
    - リクエスト: `WarehouseExpandRequest`
    - レスポンス: `WarehouseExpandResult`
  - `POST /api/admin/warehouse/item/deposit`: プレイヤー所持品または報酬から倉庫へアイテムを保管。
    - リクエスト: `{ userId: string; itemId: string }`
    - レスポンス: `boolean`
  - `POST /api/admin/warehouse/item/withdraw`: 倉庫からプレイヤーインベントリへアイテムを引き出し。
    - リクエスト: `{ userId: string; itemId: string }`
    - レスポンス: `InventoryItem`
  - `POST /api/admin/warehouse/monster/status`: 保管中モンスターの稼働状態更新。
    - リクエスト: `{ monsterId: string; status: 'idle' | 'placed' | 'expedition' }`
    - レスポンス: `boolean`
  - `POST /api/admin/warehouse/monster/breed`: モンスターの繁殖を実行。
    - リクエスト: `{ parentId1: string, parentId2: string }`
    - レスポンス: `StoredMonster` (生成された卵/幼体)
- **設置施設設定管理**
  - `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/statue`: 配置済み彫像の特殊効果変更。
    - リクエスト: `StatueConfig`
  - `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/altar`: 配置済み祭壇の祀る神・信仰度変更。
    - リクエスト: `AltarConfig`
  - `PUT /api/admin/dungeon/{dungeonId}/facility/{facilityId}/fishing`: 配置済み釣り堀の構成（利用料等）変更。
    - リクエスト: `FishingPointConfig`
- **モンスター遠征管理**
  - `GET /api/admin/expedition/destinations`: 派遣可能な遠征目的地一覧の取得。
    - レスポンス: `ExpeditionDestination[]`
  - `GET /api/admin/expeditions`: 現在派遣中の遠征隊一覧の取得。
    - レスポンス: `ExpeditionState[]`
  - `POST /api/admin/expedition/dispatch`: 遠征隊の派遣開始。
    - リクエスト: `{ destinationId: string; monsterIds: string[] }`
    - レスポンス: `ExpeditionState`
  - `POST /api/admin/expedition/{expeditionId}/claim`: 完了した遠征の報酬受取およびモンスターの帰還。
    - レスポンス: `ExpeditionClaimResult`
- **ショップ管理**
  - `POST /api/admin/shop`: ダンジョン内にショップを新規設置。
    - リクエスト: `ShopConfig`
  - `PUT /api/admin/shop/{shopId}/slots`: ショップの陳列商品と価格を更新。
    - リクエスト: `ShopSlot[]`
- **トラストネットワーク (世界間連携)**
  - `GET /api/admin/trust-network`: 信頼関係にあるサーバーの一覧を取得。
    - レスポンス: `TrustedServer[]`
  - `POST /api/admin/trust-network/server`: 新しいサーバーとの信頼関係を構築（申請）。
    - リクエスト: `{ serverUrl: string, policy: TrustPolicy }`
  - `PUT /api/admin/trust-network/server/{serverId}`: 信頼ポリシーの更新。
    - リクエスト: `TrustPolicy`
- **ゲームバランス管理**
  - `GET /api/admin/balance`: 現在の動的バランス設定の取得。
    - レスポンス: `BalanceConfig`
  - `PUT /api/admin/balance`: 動的バランス設定の更新。
    - リクエスト: `Partial<BalanceConfig>`
    - レスポンス: `BalanceConfig`
  - `GET /api/admin/balance/telemetry`: 収集されたバランステレメトリデータの取得。
    - レスポンス: `BalanceTelemetry`
- **ログ管理**
  - `GET /api/admin/logs/dungeon/{dungeonId}`: 指定したダンジョンのイベントログを取得。
    - クエリパラメータ: `limit`, `offset`, `type`
    - レスポンス: `DungeonEvent[]`
  - `GET /api/admin/logs/actions`: 管理者の操作ログを取得。
    - クエリパラメータ: `limit`, `offset`, `action`
    - レスポンス: `AdminLog[]`

### 2.6 管理者介入 API (Admin Intervention API)
攻略中の特定のプレイヤーに対し、リアルタイムで干渉するためのエンドポイントです。詳細は **[管理者介入システム](../features/Admin-Intervention-System.md)** を参照してください。

- **モンスター召喚**
  - `POST /api/admin/intervention/player/{userId}/summon`: 倉庫内のモンスターを対象のプレイヤーが攻略中のフロアに即座に召喚。
    - リクエスト: `{ monsterId: string, position: { x: number, y: number } }`
    - レスポンス: `boolean` (召喚成功の成否)
- **トラップ・効果の発動**
  - `POST /api/admin/intervention/player/{userId}/trigger`: 指定した座標のトラップを強制的に発動、または特殊な環境効果（落雷、落石等）を発生させる。
    - リクエスト: `{ position: { x: number, y: number }, effectId?: string }`
    - `effectId` 例: `lightning` (落雷), `gas_leak` (ガス漏れ), `rock_fall` (落石), `earthquake` (地震)
    - レスポンス: `boolean` (発動成功の成否)

### 2.7 ランキング API (Ranking API)
プレイヤーの各種ロールにおける実績やスコア順位を取得するエンドポイントです。詳細は **[ランキングシステム](../features/Ranking-System.md)** を参照してください。

- `GET /api/ranking/{category}`: カテゴリ別ランキング一覧の取得。
  - `category`: `explorer_clear`, `explorer_level`, `admin_lethality`, `admin_popularity`, `pker_slain`, `pker_level`
  - レスポンス: `RankingResponse`
- `GET /api/ranking/{category}/me/{userId}`: 指定したユーザーの現在順位と前後エントリーの取得。
  - レスポンス: `MyRankResponse`

### 2.8 観戦・リプレイ API (Spectator & Replay API)
ダンジョンのリアルタイム観戦および過去の攻略ログのリプレイ配信・取得を行うエンドポイントです。詳細は **[リプレイ・観戦システム](../features/Replay-Spectator-System.md)** を参照してください。

- **リアルタイム観戦**
  - `GET /api/spectate/dungeons`: 観戦可能なアクティブダンジョン一覧の取得。
    - レスポンス: `SpectatorSession[]`
  - `GET /api/spectate/dungeon/{dungeonId}` (SSE): 指定ダンジョンのリアルタイム観戦ストリーム。
    - ストリーム要素: `DisplayData` および リアルタイム `DungeonEvent`
  - `PUT /api/spectate/dungeon/{dungeonId}/cheer`: 観戦者用声援・リアクションスタンプの送信。
    - リクエスト: `{ stampId: string; targetUserId?: string }`
    - レスポンス: `boolean`
- **リプレイ管理・再生**
  - `GET /api/replays`: リプレイヘッダー一覧の検索・取得。
    - クエリパラメータ: `userId`, `dungeonId`, `result`, `limit`, `offset`
    - レスポンス: `ReplayHeader[]`
  - `GET /api/replays/{replayId}`: 指定リプレイの完全データ取得。
    - レスポンス: `ReplayData`
  - `POST /api/replays/{replayId}/bookmark`: 指定リプレイのお気に入り/ブックマーク登録。
    - レスポンス: `boolean`

## 3. データモデル

### 3.1 Player
```typescript
{
  id: string;        // ユーザーID
  name: string;      // ユーザー名
  gold: number;      // 所持ゴールド
  level: number;     // レベル
  exp: number;       // 現在の累積経験値
  nextExp: number;   // 次レベルまでに必要な累計経験値
  hp: number;        // 現在のHP
  maxHp: number;     // 最大HP
  stamina: number;   // 現在のスタミナ
  maxStamina: number; // 最大スタミナ
  satiety: number;   // 現在の満腹度
  maxSatiety: number; // 最大満腹度
  attack: number;    // 攻撃力
  defense: number;   // 防御力
  agility: number;   // 敏捷性（攻撃速度に影響）
  dexterity: number; // 器用さ（命中率に影響）
  speed: number;     // 素早さ（回避率に影響）
  luck: number;      // 運（トラップ発見率などに影響）
  attribute: string; // 属性 (Fire, Water, Wood, Light, Dark, None)
  monsterLevel?: number; // モンスター形態の現在のレベル (PK乱入中のみ有効)
  monsterExp?: number;   // モンスター形態の現在の累積経験値 (PK乱入中のみ有効)
  monsterNextExp?: number; // モンスター形態の現在の次レベルまでの必要累計経験値 (PK乱入中のみ有効)
  monsterLevels: { [typeId: string]: number }; // 各モンスター種別ごとの到達レベル (PKメタ・プログレッション)
  actionTime: number; // 最終行動時刻のタイムスタンプ
  weaponId?: string;    // 装備中の武器のID
  armorId?: string;     // 装備中の防具のID
  accessoryId?: string; // 装備中の装飾品のID
  inventory: InventoryItem[]; // 所持アイテムのリスト
  inventoryCapacity: number;  // インベントリの最大容量
  statusEffects: string[];    // 付与されている状態異常のリスト
  audioSettings?: AudioSettings; // 音量設定 (任意)
  unlockedLoreIds?: string[];    // 解放済みLoreのIDリスト
  unlockedTitleIds?: string[];   // アンロック済み称号のIDリスト
  activeTitleId?: string;        // 装備中の称号ID
  quests?: PlayerQuestProgress[]; // 進行中・完了クエストリスト
  fishingLevel?: number;         // 釣りスキルレベル
  fishingExp?: number;           // 釣り熟練経験値
  worldTimeState?: WorldTimeState; // ワールドの時間帯・天候状態
  bestiary?: BestiaryEntry[];     // モンスター図鑑エントリー
}
```

### 3.2 DisplayData
```typescript
{
  position: {
    x: number;
    y: number;
  };
  data: string[];    // 描画データの配列。配列の各要素は1行分の文字列を表し、position.y 行目から順に、各行の position.x 列目以降を上書きします。
}
```

### 3.3 DungeonInfo
```typescript
{
  name: string;      // ダンジョン名
  level: number;     // 現在の階層
  totalFloors: number; // 総階層数
}
```

### 3.4 PickUpResult
```typescript
{
  result: boolean;   // 取得成否
  type: number;      // アイテム種別: 1=ゴールド, 2=アイテム
  gold?: number;     // 取得したゴールド量 (type=1の場合)
  itemName?: string; // 取得したアイテム名 (type=2の場合)
  message: string;   // エラーメッセージ等 (例: 'NoObjectOnTheFloor')
}
```

### 3.5 InventoryItem
```typescript
{
  id: string;
  name: string;
  originalName: string;
  type: number;
  subType: string;
  description: string;
  isIdentified: boolean;
  isCursed: boolean;
  isBlessed: boolean;
  value: number;
  tier: number;        // アイテムの Tier (1, 2, 3)
  // 装備品および道具の補正値
  attackBonus?: number;
  defenseBonus?: number;
  agilityBonus?: number;
  dexterityBonus?: number;
  speedBonus?: number;
  luckBonus?: number;  // 運補正値
  range?: number;      // 武器の射程
  throwAttack?: number; // 投擲威力
  attribute?: string;  // 属性 (武器・防具用)
  capacityUsage?: number; // ダンジョン配置時に消費する容量
  amount?: number;     // 所持数（スタック可能なアイテム用）
}

interface InventorySortRequest {
  sortBy?: 'category' | 'tier' | 'value' | 'name'; // ソート基準
}

interface InventorySwapRequest {
  fromIndex: number; // 入れ替え元スロットインデックス
  toIndex: number;   // 入れ替え先スロットインデックス
}
```

### 3.6 CombatResult
```typescript
{
  attackerId: string;  // 攻撃者のID
  targetId: string;    // 攻撃対象のID
  isHit: boolean;      // 命中したかどうか
  damage: number;      // 与えたダメージ量
  critical: boolean;   // クリティカルヒットかどうか
  remainingHp: number; // 攻撃後の対象の残りHP
  isDead: boolean;     // 対象が死亡したかどうか
}
```

### 3.7 SearchResult
```typescript
{
  foundCount: number;  // 発見したトラップ・隠し通路の数
  message: string;     // 結果メッセージ
}
```

### 3.8 DisarmResult
```typescript
{
  result: boolean;     // 解除成否
  isTriggered: boolean; // 解除失敗時にトラップが発動したか
  message: string;     // 結果メッセージ
}
```

### 3.9 DungeonEvent
```typescript
{
  id: string;              // イベント固有ID
  timestamp: number;       // 発生時刻 (UNIXタイムスタンプ)
  dungeonId: string;       // 発生したダンジョンのID
  floorLevel: number;      // 発生した階層
  type: DungeonEventType;  // イベント種別
  userId?: string;         // 関連するユーザーID (プレイヤー等)
  details:
    | PlayerEntryDetails
    | PlayerExitDetails
    | PlayerDeathDetails
    | ItemPickUpDetails
    | MonsterSlainDetails
    | TrapTriggeredDetails
    | AdminInterventionDetails
    | ChestOpenedDetails
    | FishingAttemptDetails
    | AltarInteractionDetails
    | StatuePlacedDetails
    | QuestProgressDetails
    | TitleChangedDetails
    | WeatherChangedDetails
    | EmoteStampUsedDetails
    | BalanceTelemetryDetails;
}

type DungeonEventType =
  | 'player_entry'         // プレイヤー入場
  | 'player_exit'          // プレイヤー脱出
  | 'player_death'         // プレイヤー死亡
  | 'item_pickup'          // 重要アイテム取得
  | 'monster_slain'        // モンスター撃破
  | 'trap_triggered'       // トラップ発動
  | 'admin_intervention'   // 管理者介入
  | 'chest_opened'         // 宝箱開封・破壊
  | 'fishing_attempt'      // 釣り実行
  | 'altar_interaction'    // 祭壇との相互作用
  | 'statue_placed'        // 彫像設置・撤去
  | 'quest_progress'       // クエスト進行・達成・報酬受取
  | 'title_changed'        // 称号解放・装備変更
  | 'weather_changed'      // 天候変化
  | 'emote_stamp_used'     // エモート・スタンプ使用
  | 'balance_telemetry';   // ゲームバランス調整用テレメトリ記録

interface PlayerEntryDetails {
  entranceId: string;      // 入口のID
  position: { x: number; y: number }; // 出現座標
}

interface PlayerExitDetails {
  exitId: string;          // 出口（階段など）のID
  reason: 'escaped' | 'cleared'; // 脱出の理由
  position: { x: number; y: number }; // 脱出時の座標
}

interface PlayerDeathDetails {
  attackerId?: string;     // 攻撃者の個体ID（モンスターID等）
  attackerTypeId?: string; // 攻撃者の種別ID（'slime', 'spikes' 等）
  attackerType: 'monster' | 'trap' | 'environment' | 'pker'; // 死亡原因のカテゴリ
  position: { x: number; y: number }; // 死亡座標
  lostGold: number;        // 没収されたゴールド量
  lostItems: string[];     // 没収されたアイテムのIDリスト
}

interface ItemPickUpDetails {
  itemId: string;          // アイテム個体ID
  itemTypeId: string;      // アイテム種別ID
  itemName: string;        // アイテム名
  position: { x: number; y: number }; // 取得座標
  isGold: boolean;         // ゴールドかどうか
  amount?: number;         // ゴールドの場合の金額
}

interface MonsterSlainDetails {
  monsterId: string;       // モンスター個体ID
  monsterTypeId: string;   // モンスター種別ID
  killerId: string;        // 撃破者のID（プレイヤーID等）
  position: { x: number; y: number }; // 撃破座標
  gainedExp: number;       // プレイヤーが獲得した経験値
}

interface TrapTriggeredDetails {
  trapTypeId: string;      // トラップ種別ID
  position: { x: number; y: number }; // トラップの座標
  triggeredBy: string;     // 発動させたエンティティのID
  isFound: boolean;        // 発動前に発見されていたか
  damageDealt?: number;    // 与えたダメージ
  statusEffect?: string;   // 付与された状態異常
}

interface AdminInterventionDetails {
  actionType: 'summon' | 'trigger'; // 介入種別
  targetUserId: string;    // 対象プレイヤーID
  position: { x: number; y: number }; // 介入地点の座標
  monsterId?: string;      // 召喚したモンスターのID（summonの場合）
  effectId?: string;       // 発生させた効果のID（triggerの場合）
}

interface ChestOpenedDetails {
  chestType: 'wooden' | 'iron' | 'magic' | 'mimic';           // 宝箱の種類
  action: 'unlock_hand' | 'unlock_key' | 'smash' | 'inspect';  // 実行したアクション
  result: 'success' | 'failed_locked' | 'failed_jammed' | 'trap_triggered' | 'mimic_awakened' | 'broken'; // 開封結果
  itemId?: string;                                            // 獲得したアイテム種別ID (成功時)
  itemName?: string;                                          // 獲得したアイテム名 (成功時)
  damageDealt?: number;                                       // 罠やミミック、または破壊時の破片で受けたダメージ
  position: { x: number; y: number };                         // 宝箱の座標
}

interface FishingAttemptDetails {
  rodTypeId: string;                                          // 使用した釣り竿のID (例: 'rod_wood')
  baitTypeId?: string;                                        // 使用したエサのID (例: 'bait_worm')
  result: 'success' | 'missed' | 'monster_ambush' | 'no_bait'; // 釣りの結果
  catchItemTypeId?: string;                                   // 釣り上げたアイテム/魚の種別ID (成功時)
  fishingLevel: number;                                       // 実行時のプレイヤー釣りレベル
  position: { x: number; y: number };                         // 釣りポイントの座標
}

interface AltarInteractionDetails {
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna';          // 祀られている神のID
  action: 'pray' | 'offer_gold' | 'offer_item' | 'desecrate' | 'loot'; // 実行したアクション
  offerDetails?: {                                            // 捧げ物の詳細
    itemId?: string;                                          // 捧げたアイテムID
    goldAmount?: number;                                      // 捧げたゴールド
  };
  result: 'divine_blessing' | 'divine_punishment' | 'favor_increased' | 'favor_decreased' | 'loot_success' | 'loot_failed_punished'; // 結果
  position: { x: number; y: number };                         // 祭壇の座標
}

interface StatuePlacedDetails {
  action: 'place' | 'remove';                                 // 設置または撤去
  effectType: 'dread' | 'guardian' | 'healing' | 'greed' | 'glow'; // 彫像の効果種類
  position: { x: number; y: number };                         // 設置座標
}

interface QuestProgressDetails {
  questId: string;                                            // 対象クエストのID
  action: 'accept' | 'advance' | 'complete' | 'claim_rewards'; // クエストのアクション
  progressCount?: number;                                     // 進捗状況 ('advance' 時)
  rewardsClaimed?: {                                          // 獲得した報酬 ('claim_rewards' 時)
    gold?: number;
    exp?: number;
    materials?: { typeId: string; amount: number }[];
    items?: string[];
  };
}

interface TitleChangedDetails {
  titleId: string;                                            // 対象の称号ID
  action: 'unlock' | 'equip' | 'unequip';                     // 称号のアクション
}

interface WeatherChangedDetails {
  previousWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave'; // 変更前の天候
  newWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave';      // 変更後の天候
}

interface EmoteStampUsedDetails {
  targetType: 'emote' | 'stamp';                              // エモートまたはスタンプ
  targetId: string;                                           // エモートIDまたはスタンプID
  speakerRole: 'explorer' | 'admin' | 'pker';                  // 使用者の役割
  position: { x: number; y: number };                         // 使用された座標
}

interface BalanceTelemetryDetails {
  metricType: 'death' | 'item_usage' | 'pk_win_ratio' | 'matchmaking_failure'; // テレメトリの指標種別
  details: any;                                               // 指標の詳細データ
}
```

### 3.10 Chest Open Result
```typescript
interface ChestOpenResult {
  result: 'success' | 'failed_locked' | 'failed_jammed' | 'trap_triggered' | 'mimic_awakened' | 'broken';
  loot?: InventoryItem;
  trapDetails?: string; // 罠発動時の詳細など
  message: string;
}
```

### 3.11 Shop Action Results
```typescript
interface BuyResult {
  result: boolean;      // 購入成否
  item?: InventoryItem; // 購入したアイテム
  lostGold?: number;    // 消費したゴールド
  message: string;      // 結果メッセージ
}

interface SellResult {
  result: boolean;      // 売却成否
  gainedGold?: number;  // 獲得したゴールド
  message: string;      // 結果メッセージ
}

interface AppraiseResult {
  result: boolean;      // 鑑定成否
  item?: InventoryItem; // 鑑定後のアイテム情報
  lostGold?: number;    // 消費した鑑定料
  message: string;      // 結果メッセージ
}
```

### 3.12 DungeonExitResult
```typescript
interface DungeonExitResult {
  result: boolean;      // 脱出/クリア成否
  reason: 'escaped' | 'cleared'; // 理由
  rewards?: {           // 獲得した報酬（クリア時など）
    gold: number;
    items: InventoryItem[];
  };
  message: string;      // 結果メッセージ
}
```

### 3.13 Fishing Results
```typescript
interface FishCastResult {
  result: 'waiting' | 'failed_no_bait' | 'failed_invalid_tile';
  waitTicks?: number;   // ヒット発生までの待機時間（ティック）
  message: string;
}

interface FishingHookResult {
  result: 'success' | 'missed' | 'monster_ambush';
  loot?: InventoryItem; // 釣り上げた魚・資材・宝箱
  ambushMonsterId?: string; // モンスター襲撃時の個体/種別ID
  gainedExp?: number;   // 獲得した釣り熟練経験値
  message: string;
}
```

### 3.14 AltarActionResult
```typescript
interface AltarActionResult {
  result: 'divine_blessing' | 'divine_punishment' | 'favor_increased' | 'favor_decreased' | 'loot_success' | 'loot_failed_punished';
  grantedEffect?: string; // 付与されたバフ/デバフ名 (DIVINE_BLESSING, DIVINE_PUNISHMENT 等)
  lootedItems?: InventoryItem[]; // 略奪に成功した場合のアイテム
  lootedGold?: number;          // 略奪に成功した場合のゴールド
  favorLevel: number;           // 更新後の信仰度レベル
  message: string;
}
```

### 3.15 Quest Models
```typescript
interface QuestEntry {
  id: string;                                                 // ユニークID (例: 'slime_hunter_01')
  title: string;                                              // クエストタイトル
  description: string;                                        // クエストの説明文
  category: 'explorer' | 'admin' | 'pker';                    // 対象ロール
  targetType: 'defeat_monster' | 'clear_floor' | 'synthesize_item' | 'earn_gold' | 'trap_kills' | 'use_stamp'; // 目標アクション
  targetId?: string;                                          // 特定の対象ID
  targetCount: number;                                        // 必要な達成回数
  rewards: {
    gold?: number;
    exp?: number;
    materials?: { typeId: string; amount: number }[];
    items?: string[];                                         // 獲得アイテムのIDリスト
    customStampId?: string;                                   // 特殊スタンプ解放
  };
}

interface PlayerQuestProgress {
  questId: string;                                            // 対象クエストのID
  currentCount: number;                                       // 現在のカウント
  status: 'active' | 'completed' | 'claimed';                 // 進行ステータス
  acceptedAt?: Date;                                          // 受注日時
  completedAt?: Date;                                         // 達成日時
}

interface QuestClaimResult {
  result: boolean;
  rewardsClaimed?: {
    gold?: number;
    exp?: number;
    materials?: { typeId: string; amount: number }[];
    items?: InventoryItem[];
  };
  message: string;
}
```

### 3.16 Title Models
```typescript
interface TitleEntry {
  id: string;                                                 // ユニークID
  name: string;                                               // 称号名 (例: '深淵の探究者')
  description: string;                                        // 実績解除の条件説明
  effectDescription: string;                                  // 特殊効果の説明
  category: 'explorer' | 'admin' | 'pker' | 'special';        // カテゴリ分類
  unlockCondition: {
    type: 'max_floor' | 'breed_count' | 'pk_wins' | 'lore_count' | 'gold_spent'; // 解除トリガー種別
    value: number;                                            // 必要閾値
  };
  unlockedAt?: Date;                                          // 解放日時 (未解放時は undefined)
}
```

### 3.17 BestiaryEntry Model
```typescript
interface BestiaryEntry {
  monsterTypeId: string;      // モンスター種別ID
  researchLevel: 0 | 1 | 2 | 3; // 現在の研究レベル (0:シルエット, 1:基本解析, 2:詳細解析, 3:完全解析)
  encounterCount: number;     // 遭遇回数
  defeatCount: number;        // 撃破回数
  captureCount: number;       // 捕獲回数
  breedCount: number;         // 孵化（繁殖）回数
  unlockedAt?: Date;          // 最初に Level 1 に到達した日時
}
```

### 3.18 Expedition Models
```typescript
interface ExpeditionDestination {
  id: string;                    // 目的地固有ID
  name: string;                  // 目的地名
  tier: 1 | 2 | 3;               // Tierレベル
  biomeId: 'cave' | 'forest' | 'ice' | 'lava'; // バイオームID
  durationMinutes: number;       // 所要時間（分）
  goldCost: number;              // 必要ゴールドコスト
  vigorCostPerMonster: number;   // モンスター1体あたりの消費活力 (標準30)
  requiredLevel: number;         // 要求される最低レベル
  rewards: {
    expBase: number;
    goldMin: number;
    goldMax: number;
    possibleMaterials: { typeId: string; chance: number; amountMin: number; amountMax: number }[];
    possibleItems: { itemTypeId: string; chance: number }[];
    possibleEggs: { monsterTypeId: string; chance: number }[];
  };
}

interface ExpeditionState {
  id: string;                    // 遠征セッションID
  destinationId: string;         // 遠征先ID
  monsterIds: string[];          // 派遣中のモンスター個体IDリスト
  startTime: number;             // 開始時刻 (UNIXタイムスタンプ)
  endTime: number;               // 完了予定時刻 (UNIXタイムスタンプ)
  status: 'ongoing' | 'completed' | 'claimed'; // 遠征状態
}

interface ExpeditionClaimResult {
  result: boolean;
  gainedExp: number;
  gainedGold: number;
  materials: { typeId: string; count: number }[];
  items: InventoryItem[];
  eggs: StoredMonster[];
  message: string;
}
```

### 3.19 Ranking Models
```typescript
interface RankingEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  title?: string;
  details?: string;
  change?: 'up' | 'down' | 'stay' | 'new';
}

interface RankingResponse {
  category: 'explorer_clear' | 'explorer_level' | 'admin_lethality' | 'admin_popularity' | 'pker_slain' | 'pker_level';
  entries: RankingEntry[];
  totalEntries: number;
}

interface MyRankResponse {
  category: string;
  myEntry?: RankingEntry;
  surroundingEntries: RankingEntry[];
}
```

### 3.20 Story and Lore Models
```typescript
interface LoreEntry {
  id: string;                                                         // ユニークID (例: 'ancient_core_01')
  title: string;                                                      // タイトル (例: '大いなるコアの記録 1')
  category: 'history' | 'biography' | 'dungeon_secret' | 'npc_diary'; // カテゴリ
  unlockedAt?: Date;                                                  // 解放日時
  hintMessage: string;                                                // 未解放時のヒントメッセージ
  content: string[];                                                  // 本文の段落リスト
}

interface LoreUnlockRequest {
  loreId: string; // 解禁するロアのID
}

interface LoreUnlockResult {
  success: boolean;       // 解禁の成否
  newlyUnlocked: boolean; // 新規解禁か（既に解禁済みだった場合は false）
  lore?: LoreEntry;       // 解禁されたロアの情報
  message: string;        // 結果メッセージ
}

interface NpcDialogue {
  id: string;                     // ダイアログID
  npcId: string;                  // 対象のNPC ID (例: 'merchant_anna')
  triggerCondition: {
    requiredPlayerLevel?: number; // 必要なプレイヤーレベル
    requiredLoreId?: string;      // 必要な解放済みLore ID
    requiredFloor?: number;       // 必要な到達階層
  };
  dialogueLines: string[];        // 会話テキスト
}
```

### 3.21 SaveData
```typescript
interface SaveData {
  userId: string;          // ユーザーID
  player: Player;          // プレイヤーの動的ステータス
  dungeonConfig: DungeonConfig; // 管理しているダンジョンの設定
  warehouseState: WarehouseState; // 倉庫（ストック）の状態
}
```

### 3.22 Replay Models
```typescript
interface ReplayHeader {
  replayId: string;           // リプレイ固有ID
  dungeonId: string;          // 対象ダンジョンID
  dungeonName: string;        // ダンジョン名
  floorCount: number;         // 記録対象の総階層数
  userId: string;             // プレイヤーユーザーID
  username: string;           // プレイヤー名
  role: 'explorer' | 'pker';  // メインプレイヤーのロール
  seed: number;               // マップ生成シード値
  startTime: number;          // 開始日時 (UNIXタイムスタンプ)
  durationTicks: number;      // 総経過ティック数
  result: 'cleared' | 'escaped' | 'died'; // 攻略結果
  clearTimeSeconds: number;   // 実経過時間（秒）
  clientVersion: string;      // 記録時のクライアント/ゲームバージョン
}

interface ReplayFrame {
  tick: number;               // 経過ティック数
  timestamp: number;          // 発生タイムスタンプ
  commands?: {                // 該当ティックで実行された操作コマンド
    userId: string;
    command: string;
    args?: any;
  }[];
  events?: DungeonEvent[];     // 該当ティックで発生したイベントログ
  entityUpdates?: {           // 位置やステータスに更新があったエンティティ
    entityId: string;
    position?: { x: number; y: number };
    hp?: number;
    stamina?: number;
    statusEffects?: string[];
  }[];
}

interface ReplayData {
  header: ReplayHeader;
  frames: ReplayFrame[];
}

interface SpectatorSession {
  dungeonId: string;
  activeExplorers: { userId: string; username: string; currentFloor: number }[];
  spectatorCount: number;
  viewMode: 'full_view' | 'player_los';
}
```

### 3.23 AudioSettings
```typescript
interface AudioSettings {
  masterVolume: number; // 0〜100
  bgmVolume: number;    // 0〜100
  seVolume: number;     // 0〜100
}
```

### 3.24 WorldTimeState
```typescript
interface WorldTimeState {
  timeOfDay: 'day' | 'night';                                  // 現在の時間帯
  totalTicks: number;                                          // ゲーム全体の累積経過ティック
  currentTickInCycle: number;                                  // 現在の一日のサイクル内ティック (0〜119)
  currentWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave'; // 現在の天候
  weatherTicksRemaining: number;                               // 現在の天候が継続する残りティック数
}
```

### 3.25 TerrainEntry Model
```typescript
interface TerrainEntry {
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

### 3.26 TrapEntry Model
```typescript
interface TrapEntry {
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

### 3.27 Game Balance Models
```typescript
interface BalanceConfig {
  baseItemSpawnLimit: { min: number; max: number };
  baseGoldSpawnLimit: { min: number; max: number };
  monsterSpawnInterval: number; // 標準値: 50
  monsterFloorLimit: number;    // 標準値: 20
  expGainMultiplier: number;    // 標準値: 1.0
  goldGainMultiplier: number;   // 標準値: 1.0
  monsterStatScalingFactor: number; // 標準値: 1.0
  strayLevelOffset: number;     // 標準値: 0
  baseShopBuybackRate: number;  // 標準値: 0.3
  circulationLimitModifier: number; // 標準値: 1.0
  constructionCostMultiplier: number; // 標準値: 1.0
  pkMatchLevelRange: number;    // 標準値: 10
  pkProtectionCooldownMinutes: number; // 標準値: 20
}

interface BalanceTelemetry {
  deathHeatmap: {
    floorLevel: number;
    position: { x: number; y: number };
    cause: 'monster' | 'trap' | 'hunger' | 'pker' | 'environment';
    causeId?: string;
    timestamp: number;
  }[];
  itemUsageStats: {
    itemId: string;
    action: 'consumed' | 'sold' | 'synthesized' | 'discarded';
    count: number;
  }[];
  pkWinRatio: {
    explorerWins: number;
    pkerWins: number;
    averageBattleDurationSeconds: number;
  };
  matchmakingFailureRate: number;
}
```

### 3.28 Warehouse Models
```typescript
interface WarehouseExpandRequest {
  targetType: 'monster' | 'item' | 'material'; // 拡張対象の倉庫枠
  incrementAmount: number;                     // 増加スロット数 (例: モンスター+10, アイテム+20, 資材+1000)
}

interface WarehouseExpandResult {
  success: boolean;                            // 拡張成否
  updatedWarehouseState?: WarehouseState;      // 更新後の倉庫状態
  consumedGold?: number;                       // 消費したゴールド
  consumedMaterials?: { typeId: string; amount: number }[]; // 消費した資材リスト
  message: string;                             // 結果メッセージ
}
```

### 3.29 Mail Models
```typescript
interface MailMessage {
  id: string;                                                // メール固有ID
  recipientUserId: string;                                    // 受信者のユーザーID
  senderName: string;                                         // 送信者名 (例: 'システム運営', 'ランキング協会')
  title: string;                                              // 件名
  content: string;                                            // 本文
  category: 'system' | 'ranking' | 'dungeon_overflow' | 'gift'; // メール種別
  isRead: boolean;                                            // 既読フラグ
  isClaimed: boolean;                                         // 添付品受取済みフラグ
  createdAt: Date | string;                                   // 送信日時
  expiresAt?: Date | string;                                  // 有効期限
  attachments?: MailAttachment;                               // 添付報酬/アイテム
}

interface MailAttachment {
  gold?: number;                                              // 獲得ゴールド
  exp?: number;                                               // 獲得経験値
  items?: InventoryItem[];                                    // 獲得アイテムのリスト
  materials?: { typeId: string; amount: number }[];           // 獲得資材のリスト
}

interface MailClaimResult {
  success: boolean;                                           // 受取成否
  claimedAttachment?: MailAttachment;                         // 受け取った報酬
  transferredToWarehouse?: boolean;                           // インベントリ超過により倉庫へ転送されたか
  message: string;                                            // 結果メッセージ
}
```

詳細は **[イベントログ詳細仕様](Event-Log-Schemas.md)** を参照してください。

## 4. フィールドマップ記号 (Field Map Symbols)
ダンジョンの描画データ（`DisplayData`）で使用される主な記号と、それが表すオブジェクトの定義です。

| 記号 | オブジェクト | 備考 |
| :--- | :--- | :--- |
| `@` | プレイヤー (Self) | 自身の現在位置。 |
| `P` | 他のプレイヤー (Other Player) | 同じ階層を探索中の他プレイヤー。 |
| `#` | 壁 (Wall) | 通行不能な境界。 |
| `.` | 床 (Floor) | 移動可能なエリア。 |
| `M` | モンスター (Monster) | 敵対的または中立のエンティティ。 |
| `G` | ゴールド (Gold) | 拾得可能な通貨。 |
| `I` | アイテム (Item) | 武器、防具、消耗品等のアイテム。 |
| `^` | トラップ (Trap) | 発見済みの罠。 |
| `+` | 扉 (Door) | 部屋の出入り口。開閉可能。 |
| `&` | 回復の泉 (Recovery Spring) | 触れている間、HP/スタミナを回復。 |
| `O` | 転送門 (Teleport Gate) | 階層内の別地点へワープ。 |
| `>` | 下り階段 (Down Stairs) | 次の階層へ進む。 |
| `<` | 上り階段 (Up Stairs) | 前の階層へ戻る（または脱出）。 |
| `$` | ショップ (Shop) | アイテムの売買が可能な場所。 |
| `~` | 水 (Water) | 移動・行動に時間がかかる。 |
| `!` | 溶岩 (Lava) | 踏むとダメージを受ける。 |
| `:` | 砂地 (Sand) | 移動・行動がわずかに遅くなる。 |
| `C` | 宝箱 (Chest) | 開錠または破壊可能。ミミック潜伏の場合あり。 |
| `F` | 釣り堀 (Fishing Point) | 管理者が設置可能な専用釣りポイント。 |
| `A` | 祭壇 (Altar) | 四大神を祀り、祈願、捧げ物、冒涜・略奪が可能。 |
| `S` | 彫像 (Statue) | 周囲エンティティへのバフ・デバフ効果を発揮。 |

## 5. 技術的詳細

### 5.1 主要サービス
- **FieldsAccessService**: 全てのHTTPリクエスト（REST API）を統括します。
- **SseFieldService**: `EventSource` を使用し、バックエンドからのフィールド更新イベントをリアルタイムに受信します。
- **IntervalService**: `rxjs` の `interval` をラップし、ゲーム内の定期的なイベント（スタミナ回復等）のトリガーを提供します。
- **StorageService**: ブラウザの `localStorage` へのアクセスをカプセル化し、プレイヤー情報の永続化等を行います。

### 5.2 リアルタイム更新 (SSE)
- `SseFieldService` を通じて `GET /api/fields/{userId}` から配信されるイベントを購読します。
- 他のプレイヤーの移動や環境の変化がリアルタイムに反映されます。

### 5.3 セッション管理
- `StorageService` を使用して、ブラウザの `localStorage` に `playerId` を保存します。

### 5.4 フロントエンドでの状態管理
- `PlayerDomain` クラスがプレイヤーの現在の状態（HP、スタミナ等）を管理しています。
- 内部的に `CurrentStatus` クラスを持ち、HP/スタミナの動的な変更を扱います。
- サーバーから取得した `Player` オブジェクトに基づき、HP、スタミナ、最大HP、最大スタミナが初期化されます。

### 5.5 アクション・回復のフロントエンド制御ロジック

#### アクションインターバル管理
- プレイヤーの各行動には、[アクションシステム](../features/Action-System.md)に基づいた待機時間（インターバル）を適用します。
- クライアント側では `actionTime` と `agility` を用いて、次の行動が可能かどうかを判定します。
  - `実効インターバル = 基本インターバル / (1 + 敏捷性 / 100)`
- 地形（水、砂地）や状態異常（鈍足）による補正倍率を基本インターバルに乗算します。

#### 満腹度とスタミナの消費
- **時間経過**: [満腹度システム](../features/Hunger-System.md)に基づき、満腹度が減少します。
- **アクション消費**: [満腹度システム](../features/Hunger-System.md)および[アクションシステム](../features/Action-System.md)に基づき、満腹度およびスタミナが減少します。
- スタミナが不足している場合は HP を消費します。詳細は[アクションシステム](../features/Action-System.md)を参照してください。

#### 自然回復の周期処理
- [自然回復システム](../features/Natural-Recovery-System.md)に基づき、一定周期（1ティック）ごとに HP とスタミナが回復します。
- 満腹度の状態（満腹、空腹、飢餓）に応じた回復補正が適用されます。
