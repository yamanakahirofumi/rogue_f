export class CurrentStatus {
  private hp: number;
  private maxHp: number;
  private stamina: number;
  private maxStamina: number;
  private actionInterval: number;

  public constructor(hp: number, maxHp: number, stamina: number, maxStamina: number, actionInterval: number) {
    this.hp = hp;
    this.maxHp = maxHp;
    this.stamina = stamina;
    this.maxStamina = maxStamina;
    this.actionInterval = actionInterval;
  }

  public getActionInterval(): number {
    return this.actionInterval;
  }

  public setActionInterval(v: number): void {
    this.actionInterval = v;
  }

  public getStamina(): number {
    return this.stamina;
  }

  public minusStamina(v: number = 1): void {
    if (this.stamina < v) {
      const diff = v - this.stamina;
      this.stamina = 0;
      this.minusHp(diff);
    } else {
      this.stamina -= v;
    }
  }

  public getHp() {
    return this.hp;
  }

  public minusHp(v: number) {
    this.hp -= v;
    if (this.hp < 0) {
      this.hp = 0;
    }
  }

  public recover(satietyRate: number): void {
    let multiplier = 1.0;
    if (satietyRate >= 0.8) {
      multiplier = 1.2;
    } else if (satietyRate < 0.2) {
      multiplier = 0;
    }

    if (multiplier > 0) {
      this.addHp(Math.max(1, Math.floor(this.maxHp * 0.01 * multiplier)));
      this.addStamina(Math.max(1, Math.floor(this.maxStamina * 0.01 * multiplier)));
    }
  }

  public addHp(v: number) {
    this.hp = Math.min(this.hp + v, this.maxHp);
  }

  public addStamina(v: number = 1) {
    this.stamina = Math.min(this.stamina + v, this.maxStamina);
  }
}
