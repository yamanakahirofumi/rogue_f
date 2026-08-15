import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-status-bar',
    templateUrl: './status-bar.component.html',
    styleUrls: ['./status-bar.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StatusBarComponent {

  @Input()
  get second(): number {
    return this.secondNumber;
  }

  set second(s: number) {
    this.secondNumber = Math.max(s, 0);
  }

  @Input()
  get changeFlg(): boolean {
    return this.flg;
  }

  set changeFlg(f: boolean) {
    this.flg = f;
    if (f) {
      this._value = 100;
      this._beforeValue = 0;
      this.resetAndAnimate();
    }
  }

  @Input()
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._beforeValue = this._value;
    this._value = v;
    this.updateWidth();
  }

  @Input()
  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(m: number) {
    this._maxValue = m;
    this.updateWidth();
  }

  private flg: boolean = false;
  secondNumber: number = 0;
  _maxValue: number = 100;
  _beforeValue: number = 0;
  _value: number = 0;
  currentWidth: number = 0;
  isTransitioning: boolean = true;
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private cdr: ChangeDetectorRef) {
  }

  private resetAndAnimate(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.isTransitioning = false;
    this.currentWidth = this._maxValue > 0 ? (this._beforeValue / this._maxValue) * 100 : 0;
    this.cdr.markForCheck();

    this.resetTimeout = setTimeout(() => {
      this.isTransitioning = true;
      this.updateWidth();
    }, 0);
  }

  private updateWidth(): void {
    if (this._maxValue <= 0) {
      this.currentWidth = 0;
    } else {
      this.currentWidth = Math.min(100, Math.max(0, (this._value / this._maxValue) * 100));
    }
    this.cdr.markForCheck();
  }

  onTransitionEnd(): void {
    this.flg = false;
  }
}
