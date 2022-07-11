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

  public getStamina(): number {
    return this.stamina;
  }

  public minusStamina(): void {
    if (this.stamina <= 0) {
      this.minusHp(1);
    } else {
      this.stamina--;
    }
  }

  public getHp() {
    return this.hp;
  }

  public minusHp(v: number) {
    this.hp -= v;
  }

  addStamina() {
    if (this.stamina < 100) {
      this.stamina++;
    }
  }
}
