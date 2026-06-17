import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MessageComponent implements OnInit {

  @Input()
  message: string;


  constructor() {
    this.message = "";
  }

  ngOnInit(): void {
  }
}
