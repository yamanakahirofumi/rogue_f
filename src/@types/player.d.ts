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
  range?: number;
  throwAttack?: number;
  attribute?: string;  // 属性 (武器・防具用)
  capacityUsage?: number;
  amount?: number;      // 所持数（スタック可能なアイテム用）
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
