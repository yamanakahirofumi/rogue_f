import {CurrentStatus} from './current-status';

export class PlayerDomain {
  private readonly id: string;
  private readonly name: string;
  private gold: number = 0;
  private actionTime: number;
  private currentStatus: CurrentStatus;
  private status: { [name: string]: number } = {};
  private agility: number;
  private satiety: number;
  private maxSatiety: number;
  private statusEffects: string[] = [];

  constructor(player: Player) {
    this.id = player.id;
    this.name = player.name;
    this.gold = player.gold;
    this.agility = player.agility;
    this.satiety = player.satiety;
    this.maxSatiety = player.maxSatiety;
    this.statusEffects = player.statusEffects || [];
    this.actionTime = new Date().getTime();
    const interval = this.calculateInterval(0.5); // デフォルトは移動の基本インターバル 0.5s
    this.currentStatus = new CurrentStatus(player.hp, player.maxHp, player.stamina, player.maxStamina, interval);
    this.status['MaxStamina'] = player.maxStamina;
    this.status['MaxHp'] = player.maxHp;
  }

  private calculateInterval(baseInterval: number): number {
    let multiplier = 1.0;
    if (this.statusEffects.includes('SLOW')) {
      multiplier *= 2.0;
    }
    return (baseInterval * multiplier) / (1 + this.agility / 100);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getActionGageRecoveryTimes(): number {
    return this.currentStatus.getActionInterval();
  }

  public getStamina(): number {
    return this.currentStatus.getStamina();
  }

  public getMaxStamina(): number {
    return this.status['MaxStamina'];
  }

  public getMaxHp(): number {
    return this.status['MaxHp'];
  }

  public getHp(): number {
    return this.currentStatus.getHp();
  }

  public getSatiety(): number {
    return this.satiety;
  }

  public getMaxSatiety(): number {
    return this.maxSatiety;
  }

  public action(baseInterval: number = 0.5, staminaCost: number = 1, satietyCost: number = 0.2): void {
    if (this.isAction()) {
      this.currentStatus.setActionInterval(this.calculateInterval(baseInterval));
      this.currentStatus.minusStamina(staminaCost);
      this.actionTime = new Date().getTime();
      this.minusSatiety(satietyCost);
    }
  }

  public isAction(): boolean {
    return this.currentStatus.getActionInterval() * 1000 + this.actionTime < new Date().getTime();
  }

  public recover(): void {
    const satietyRate = this.satiety / this.maxSatiety;
    this.currentStatus.recover(satietyRate);
    if (this.satiety === 0) {
      // 飢餓ダメージ: 5秒につき1%(10秒につき2%)
      this.currentStatus.minusHp(Math.floor(this.getMaxHp() * 0.02));
    }
  }

  public minusSatiety(v: number): void {
    this.satiety = Math.max(0, this.satiety - v);
  }
}
