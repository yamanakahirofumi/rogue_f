export class Player {
  private readonly id: number;
  private readonly durationSecond: number;
  private readonly name: string;
  private actionTime: number;

  constructor(id, name) {
    this.id = id;
    this.durationSecond = 20;
    this.name = name;
    this.actionTime = new Date().getTime();
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getActionGageRecoveryTimes(): number {
    return this.durationSecond + 1;
  }

  public getActionGageRecoveryValue(): number {
    return 100 / this.durationSecond;
  }

  public action(): void {
    if (this.isAction()) {
      this.actionTime = new Date().getTime();
    }
  }

  public isAction(): boolean {
    return this.durationSecond * 1000 + this.actionTime < new Date().getTime();
  }
}
