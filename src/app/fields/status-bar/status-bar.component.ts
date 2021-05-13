import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent {
  @Input()
  get value(): number {
    return this.pValue;
  }

  set value(v: number) {
    this.pValue = Math.min(v, 100);
  }

  private pValue = 0;

  constructor() {
  }

  size() {
    const percent = this.pValue + '%';
    return {width: percent};
  }
}
