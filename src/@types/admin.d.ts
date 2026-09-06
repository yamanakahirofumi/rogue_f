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

interface ClearRewardConfig {
  gold: number;            // 獲得ゴールド
  itemIds: string[];       // 獲得アイテムのIDリスト (倉庫内ID)
}

interface ClearRewardPool {
  gold: number;            // プール内の総ゴールド
  itemIds: string[];       // プール内のアイテムIDリスト
}

interface DeathPenaltyConfig {
  itemLossRate: number;    // アイテム没収率 (0.0〜1.0)
  goldLossRate: number;    // ゴールド没収率 (0.0〜1.0)
  expLossRate: number;     // 経験値減少率 (0.0〜1.0)
  levelReset: boolean;     // レベル 1 リセットフラグ
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

interface PlacedFacility {
  typeId: 'recovery_spring' | 'teleport_gate' | 'shop_counter' | 'synthesis_workshop' | 'torch' | 'statue' | 'altar' | 'fishing_point';
  position: { x: number, y: number };
  config?: RecoverySpringConfig | TeleportGateConfig | StatueConfig | AltarConfig | FishingPointConfig;
}

interface FishingPointConfig {
  fishPoolSize: number;       // 現在の残り魚影数 (上限 10, 時間経過で自然回復)
  allowedBaitTier: number;    // 使用可能なエサの最低/最高 Tier 制限
  usageFee: number;           // 1キャストあたりの利用料（ゴールド、管理者が設定可能）
  bonusMultiplier: number;    // レア出現率補正（標準: 1.0, 施設強化で最大 1.5）
}

interface StatueConfig {
  effectType: 'dread' | 'guardian' | 'healing' | 'greed' | 'glow'; // 彫像の特殊効果
}

interface AltarConfig {
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna'; // 祀る神のID
  favorLevel: number;                                // 信仰度レベル (0〜5)
  isDesecrated: boolean;                             // 冒涜されているかフラグ
}

interface RecoverySpringConfig {
  recoveryRate: number;    // 回復倍率 (標準 1.0)
}

interface TeleportGateConfig {
  targetFloor: number;     // ワープ先階層
  targetPosition: { x: number, y: number }; // ワープ先座標
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

interface PlacedShop {
  shopId: string;          // ショップID
  position: { x: number, y: number };
}

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

interface StoredMonster {
  id: string;
  typeId: string;
  attribute: string;
  growthStage: 'larva' | 'adult'; // 成長段階
  level: number;
  exp: number;             // 現在の累積経験値
  nextExp: number;         // 次レベルまでの必要累積経験値
  vigor: number;           // 現在の活力
  maxVigor: number;        // 最大活力
  remainingBreeds: number; // 残り繁殖可能回数
  hatchTimeRemaining?: number; // 孵化までの残り時間（分）。卵の状態の場合のみ存在。
  hatchTimeTotal?: number;     // 孵化に必要な総時間（分）。卵の状態の場合のみ存在。
  stats: MonsterStats;     // 詳細ステータス
  traits: string[];        // 継承された特性
  expeditionId?: string;   // 遠征中の場合、遠征セッションID
  status?: 'idle' | 'placed' | 'expedition'; // モンスターの現在の状態
}

interface ExpeditionState {
  id: string;                    // 遠征セッションID
  destinationId: string;         // 遠征先ID (例: 'cave_tier1', 'forest_tier2', etc.)
  monsterIds: string[];          // 派遣中のモンスター個体IDリスト
  startTime: number;             // 開始時刻 (UNIXタイムスタンプ)
  endTime: number;               // 完了予定時刻 (UNIXタイムスタンプ)
  status: 'ongoing' | 'completed' | 'claimed'; // 遠征状態
}

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
    expBase: number;             // 獲得経験値
    goldMin: number;             // 獲得ゴールドの下限
    goldMax: number;             // 獲得ゴールドの上限
    possibleMaterials: {         // 獲得可能な資材のリスト
      typeId: string;
      chance: number;            // 獲得確率 (0.0〜1.0)
      amountMin: number;
      amountMax: number;
    }[];
    possibleItems: {             // 獲得可能なアイテムのリスト
      itemTypeId: string;
      chance: number;            // 獲得確率 (0.0〜1.0)
    }[];
    possibleEggs: {              // 獲得可能なモンスターの卵リスト
      monsterTypeId: string;
      chance: number;            // 獲得確率 (0.0〜1.0)
    }[];
  };
}

interface MonsterStats {
  hp: number;
  maxHp: number;
  stamina?: number;
  maxStamina?: number;
  attack: number;
  defense: number;
  agility: number;
  dexterity: number;
  speed: number;
  luck: number;
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

interface TrustedServer {
  serverId: string;        // サーバー固有のID
  serverName: string;      // サーバー名
  url: string;             // サーバーのエンドポイントURL
  trustPolicy: TrustPolicy; // 適用されている信頼ポリシー
  status: 'active' | 'pending' | 'blocked'; // 信頼関係の状態
}

interface TrustPolicy {
  itemTransfer: 'bi-directional' | 'one-way' | 'prohibited'; // アイテム持ち込み制限
  levelSync: 'full-sync' | 'copy-on-move' | 'reset';        // レベル同期設定
  canPvp: boolean;         // サーバー間を跨いだPVPの許可
}

interface DungeonEvent {
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
    | BalanceTelemetryDetails
    | SynthesisEventDetails;
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
  | 'balance_telemetry'    // ゲームバランス調整用テレメトリ記録
  | 'synthesis_event';     // アイテム合成・解体イベント

interface PlayerEntryDetails {
  entranceId: string;
  position: { x: number; y: number };
}

interface PlayerExitDetails {
  exitId: string;
  reason: 'escaped' | 'cleared';
  position: { x: number; y: number };
}

interface PlayerDeathDetails {
  attackerId?: string;
  attackerTypeId?: string;
  attackerType: 'monster' | 'trap' | 'environment' | 'pker';
  position: { x: number; y: number };
  lostGold: number;
  lostItems: string[];
}

interface ItemPickUpDetails {
  itemId: string;
  itemTypeId: string;
  itemName: string;
  position: { x: number; y: number };
  isGold: boolean;
  amount?: number;
}

interface MonsterSlainDetails {
  monsterId: string;
  monsterTypeId: string;
  killerId: string;
  position: { x: number; y: number };
  gainedExp: number;
}

interface TrapTriggeredDetails {
  trapTypeId: string;
  position: { x: number; y: number };
  triggeredBy: string;
  isFound: boolean;
  damageDealt?: number;
  statusEffect?: string;
}

interface AdminInterventionDetails {
  actionType: 'summon' | 'trigger';
  targetUserId: string;
  position: { x: number; y: number };
  monsterId?: string;
  effectId?: string;
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

interface SynthesisEventDetails {
  action: 'craft' | 'dismantle';                              // 合成または解体
  recipeId?: string;                                          // 使用したレシピID ('craft' 時)
  targetTypeId: string;                                       // 対象のアイテム/資材の種別ID
  result: 'success' | 'failed';                               // 処理結果
  consumedGold: number;                                       // 消費したゴールド (または解体費用)
  consumedMaterials?: { typeId: string; amount: number }[];   // 消費された資材リスト ('craft' 時)
  refundedGold?: number;                                      // 返金されたゴールド ('craft' 失敗時)
  recoveredMaterials?: { typeId: string; amount: number }[];  // 回収された資材リスト ('dismantle' 成功時)
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
