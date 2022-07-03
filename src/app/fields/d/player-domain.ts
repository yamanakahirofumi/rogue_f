import {CurrentStatus} from './current-status';

export class PlayerDomain {
  private readonly id: string;
  private readonly name: string;
  private gold: number = 0;
  private actionTime: number;
  private currentStatus: CurrentStatus;
  private status: { [name: string]: number } = {};

  constructor(player: Player) {
    this.id = player.id;
    this.name = player.name;
    this.actionTime = new Date().getTime();
    this.currentStatus = new CurrentStatus(50, 3, 2); //TODO: これで良いなか？
    this.status['MaxStamina'] = 100;
    this.status['MaxHp'] = 100;
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

  public action(): void {
    if (this.isAction()) {
      this.currentStatus.minusStamina();
      this.actionTime = new Date().getTime();
    }
  }

  public isAction(): boolean {
    return this.currentStatus.getActionInterval() * 1000 + this.actionTime < new Date().getTime();
  }

  addStamina() {
    this.currentStatus.addStamina();
  }
}
