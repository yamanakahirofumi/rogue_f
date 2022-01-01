import {CurrentStatus} from './current-status';

export class Player {
  private readonly id: string;
  private readonly name: string;
  private gold: number = 0;
  private actionTime: number;
  private currentStatus: CurrentStatus;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.actionTime = new Date().getTime();
    this.currentStatus = new CurrentStatus(0, 0, 0); //TODO: これで良いなか？
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getActionGageRecoveryTimes(): number {
    return this.currentStatus.getActionInterval() + 1;
  }

  public getActionGageRecoveryValue(): number {
    return 100 / this.currentStatus.getActionInterval();
  }

  public action(): void {
    if (this.isAction()) {
      this.actionTime = new Date().getTime();
    }
  }

  public isAction(): boolean {
    return this.currentStatus.getActionInterval() * 1000 + this.actionTime < new Date().getTime();
  }
}
