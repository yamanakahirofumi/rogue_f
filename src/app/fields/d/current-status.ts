export class CurrentStatus {
  private hp: number;
  private stamina: number;
  private actionInterval: number;

  public constructor(hp: number, stamina: number, actionInterval: number) {
    this.hp = hp;
    this.stamina = stamina;
    this.actionInterval = actionInterval;
  }

  public getActionInterval(): number {
    return this.actionInterval;
  }
}
