import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isSelected: Array<boolean> = [];

  constructor() {
    this.initIsSelected();
  }

  ngOnInit(): void {
    const index = this.checkFocusIndex(this.isSelected);
    this.isSelected[index] = true;
  }

  private initIsSelected() {
    this.isSelected = [false, false];
  }

  keyupEvent(event: any) {
    switch (event.key) {
      case '8':
      case 'ArrowUp':
        this.arrowUp(this.isSelected);
        return;
      case '2':
      case 'ArrowDown':
        this.arrowDown(this.isSelected);
        return;
    }
  }

  private arrowUp(selected: Array<boolean>) {
    const index = this.checkFocusIndex(selected);
    const beforeIndex = (() => {
      if (index === 0) {
        return selected.length - 1;
      }
      return index - 1;
    })();
    selected[beforeIndex] = true;
  }

  private arrowDown(selected: Array<boolean>) {
    const index = this.checkFocusIndex(selected);
    const afterIndex = (() => {
      if (selected.length === index + 1) {
        return 0;
      }
      return index + 1;
    })();
    selected[afterIndex] = true;
  }

  private checkFocusIndex(array: Array<boolean>): number {
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        array[i] = false;
        return i;
      }
    }
    return 0;
  }

  clickFocus(index: number) {
    this.initIsSelected();
    this.isSelected[index] = true;
  }
}
