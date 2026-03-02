import {Component, Input} from '@angular/core';
import {progressBar, ProgressBarStatus} from "./progress-bar.anime";
import {AnimationEvent} from "@angular/animations";

@Component({
    selector: 'app-status-bar',
    templateUrl: './status-bar.component.html',
    styleUrls: ['./status-bar.component.css'],
    animations: [progressBar],
    standalone: false
})
export class StatusBarComponent {

  @Input()
  get second(): number {
    return this.secondNumber;
  }

  set second(s: number) {
    this.secondNumber = Math.max(s, 0);
    this.status = 'after';
  }

  @Input()
  get changeFlg(): boolean {
    return this.flg;
  }

  set changeFlg(f: boolean) {
    this.flg = f;
    if (f) {
      this.status = 'before';
      this._value = 100;
      this._beforeValue = 0;
    }
  }

  @Input()
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._beforeValue = this._value;
    this._value = v;
    this.status = 'after';
  }

  @Input()
  get maxValue() {
    return this._maxValue;
  }

  set maxValue(m: number) {
    this._maxValue = m;
  }

  private flg: boolean = false;
  secondNumber: number = 0;
  _maxValue: number = 100;
  _beforeValue: number = 0;
  _value: number = 0;
  status: ProgressBarStatus = 'after';

  constructor() {
  }

  start(event: AnimationEvent) {
    if (event.fromState === 'after') {
      this.status = 'after';
    }
  }

  end(event: AnimationEvent) {
    this.flg = false;
    console.log(event);
  }

}
