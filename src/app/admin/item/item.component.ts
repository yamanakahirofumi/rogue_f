import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
