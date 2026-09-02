interface AudioSettings {
  masterVolume: number; // 0〜100
  bgmVolume: number;    // 0〜100
  seVolume: number;     // 0〜100
}

interface WorldTimeState {
  timeOfDay: 'day' | 'night';                                  // 現在の時間帯
  totalTicks: number;                                          // ゲーム全体の累積経過ティック
  currentTickInCycle: number;                                  // 現在の一日のサイクル内ティック (0〜119)
  currentWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave'; // 現在の天候
  weatherTicksRemaining: number;                               // 現在の天候が継続する残りティック数
}

declare class Player {
  id: string;
  name: string;
  gold: number;
  level: number;
  exp: number;
  nextExp: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  satiety: number;
  maxSatiety: number;
  attack: number;
  defense: number;
  agility: number;
  dexterity: number;
  speed: number;
  luck: number;
  attribute: string; // 属性 (Fire, Water, Wood, Light, Dark, None)
  monsterLevel?: number;
  monsterExp?: number;
  monsterNextExp?: number;
  monsterLevels: { [typeId: string]: number };
  actionTime: number;
  weaponId?: string;
  armorId?: string;
  accessoryId?: string;
  inventory: InventoryItem[];
  inventoryCapacity: number;
  statusEffects: string[];
  audioSettings?: AudioSettings; // オーディオ・音量設定（任意、初期設定あり）
  unlockedLoreIds?: string[];    // 解放されたLoreのIDリスト
  unlockedTitleIds?: string[];   // アンロックされた称号のIDリスト
  activeTitleId?: string;        // 現在装備中の称号のID (未装備時は undefined または空文字)
  quests?: PlayerQuestProgress[]; // 進行中のクエストリスト
  fishingLevel?: number;         // 釣りスキルレベル (任意、初期値 1)
  fishingExp?: number;           // 釣り熟練度累積経験値 (任意)
  worldTimeState?: WorldTimeState;                             // 現在の階層/ワールドの昼夜・天候状態
  bestiary?: BestiaryEntry[];                                  // モンスター図鑑のエントリーリスト
}

interface BestiaryEntry {
  monsterTypeId: string;      // モンスター種別ID (例: 'slime', 'goblin', 'fire_dragon')
  researchLevel: 0 | 1 | 2 | 3; // 現在の研究レベル (0:シルエット, 1:基本解析, 2:詳細解析, 3:完全解析)
  encounterCount: number;     // 遭遇回数
  defeatCount: number;        // 撃破回数
  captureCount: number;       // 捕獲回数
  breedCount: number;         // 孵化（繁殖）回数
  unlockedAt?: Date;          // 最初に Level 1 に到達した日時
}

interface QuestEntry {
  id: string;                                                 // ユニークID (例: 'slime_hunter_01')
  title: string;                                              // クエストタイトル (例: 'スライムハンター')
  description: string;                                        // クエストの説明文
  category: 'explorer' | 'admin' | 'pker';                    // 対象ロール
  targetType: 'defeat_monster' | 'clear_floor' | 'synthesize_item' | 'earn_gold' | 'trap_kills' | 'use_stamp'; // 目標アクション
  targetId?: string;                                          // 特定の対象ID (モンスター種別IDやアイテム種別ID等)
  targetCount: number;                                        // 必要な達成回数
  rewards: {
    gold?: number;
    exp?: number;
    materials?: { typeId: string; amount: number }[];
    items?: string[];                                         // 獲得アイテムのIDリスト (アイテムマスターリストに準拠)
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

interface TitleEntry {
  id: string;                                                 // ユニークID (例: 'deep_abyss_diver')
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

interface LoreEntry {
  id: string;                                                          // ユニークID (例: 'ancient_core_01')
  title: string;                                                       // タイトル (例: '大いなるコアの記録 1')
  category: 'history' | 'biography' | 'dungeon_secret' | 'npc_diary';  // カテゴリ
  unlockedAt?: Date;                                                   // 解放日時
  hintMessage: string;                                                 // 未解放時のヒントメッセージ
  content: string[];                                                   // 本文の段落リスト
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

interface InventoryItem {
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
  attackBonus?: number;
  defenseBonus?: number;
  agilityBonus?: number;
  dexterityBonus?: number;
  speedBonus?: number;
  luckBonus?: number;
  range?: number;
  throwAttack?: number;
  attribute?: string;  // 属性 (武器・防具用)
  capacityUsage?: number;
  amount?: number;      // 所持数（スタック可能なアイテム用）
}

interface InventorySortRequest {
  sortBy?: 'category' | 'tier' | 'value' | 'name'; // ソート基準 (未指定時はデフォルト優先度階層)
}

interface InventorySwapRequest {
  fromIndex: number; // 入れ替え元のインベントリスロットインデックス (0〜19)
  toIndex: number;   // 入れ替え先のインベントリスロットインデックス (0〜19)
}

interface DungeonInfo {
  name: string;
  level: number;
  totalFloors: number;
}

interface PickUpResult {
  result: boolean;
  type: number;
  gold?: number;
  itemName?: string;
  message: string;
}

interface CombatResult {
  attackerId: string;
  targetId: string;
  isHit: boolean;
  damage: number;
  critical: boolean;
  remainingHp: number;
  isDead: boolean;
}

interface SearchResult {
  foundCount: number;
  message: string;
}

interface DisarmResult {
  result: boolean;
  isTriggered: boolean;
  message: string;
}

interface ChestOpenResult {
  result: 'success' | 'failed_locked' | 'failed_jammed' | 'trap_triggered' | 'mimic_awakened' | 'broken';
  loot?: InventoryItem;
  trapDetails?: string; // 罠発動時の詳細など
  message: string;
}

interface BuyResult {
  result: boolean;
  item?: InventoryItem;
  lostGold?: number;
  message: string;
}

interface SellResult {
  result: boolean;
  gainedGold?: number;
  message: string;
}

interface AppraiseResult {
  result: boolean;
  item?: InventoryItem;
  lostGold?: number;
  message: string;
}

interface DungeonExitResult {
  result: boolean;
  reason: 'escaped' | 'cleared';
  rewards?: {
    gold: number;
    items: InventoryItem[];
  };
  message: string;
}

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
  events?: any[];              // 該当ティックで発生したイベントログ (DungeonEvent)
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
