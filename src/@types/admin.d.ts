interface DungeonConfig {
  id: string;              // ダンジョンID
  name: string;            // ダンジョン名
  ownerId: string;         // 管理者のユーザーID
  description: string;     // ダンジョンの説明文
  isPublic: boolean;       // 公開フラグ
  entryFee: number;        // 入場料 (ゴールド)
  totalFloors: number;     // 総階層数
  deathPenalty: DeathPenaltyConfig; // デスペナルティ設定
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
  tiles: string[][];       // 地形データ (2次元配列)
  monsters: PlacedMonster[]; // 配置済みモンスター
  traps: PlacedTrap[];       // 配置済みトラップ
  shops: PlacedShop[];       // 設置済みショップ
  facilities: PlacedFacility[]; // 設置済み施設
}

interface PlacedFacility {
  typeId: 'recovery_spring' | 'teleport_gate' | 'shop_counter' | 'torch' | 'statue';
  position: { x: number, y: number };
  config?: RecoverySpringConfig | TeleportGateConfig;
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
  level: number;
  exp: number;             // 現在の累積経験値
  nextExp: number;         // 次レベルまでの必要累積経験値
  vigor: number;           // 現在の活力
  maxVigor: number;        // 最大活力
  hatchTimeRemaining?: number; // 孵化までの残り時間（分）。卵の状態の場合のみ存在。
  hatchTimeTotal?: number;     // 孵化に必要な総時間（分）。卵の状態の場合のみ存在。
  stats: MonsterStats;     // 詳細ステータス
  traits: string[];        // 継承された特性
}

interface MonsterStats {
  hp: number;
  maxHp: number;
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
  details: PlayerEntryDetails | PlayerExitDetails | PlayerDeathDetails | ItemPickUpDetails | MonsterSlainDetails | TrapTriggeredDetails | AdminInterventionDetails;
}

type DungeonEventType =
  | 'player_entry'         // プレイヤー入場
  | 'player_exit'          // プレイヤー脱出
  | 'player_death'         // プレイヤー死亡
  | 'item_pickup'          // 重要アイテム取得
  | 'monster_slain'        // モンスター撃破
  | 'trap_triggered'       // トラップ発動
  | 'admin_intervention';  // 管理者介入

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
