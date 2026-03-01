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
  actionTime: number;
  inventory: InventoryItem[];
  inventoryCapacity: number;
  statusEffects: string[];
}

interface InventoryItem {
  id: string;
  name: string;
  originalName: string;
  type: number;
  subType: string;
  description: string;
  isIdentified: boolean;
  value: number;
}
