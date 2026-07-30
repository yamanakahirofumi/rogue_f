interface AudioSettings {
  masterVolume: number; // 0〜100
  bgmVolume: number;    // 0〜100
  seVolume: number;     // 0〜100
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
