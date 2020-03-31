import {Component, OnInit} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {

  constructor(private access: FieldsAccessService) {
  }

  fieldMap: string[][];

  ngOnInit(): void {
    this.access.start().subscribe(() =>
      this.access.get().subscribe(it => this.fieldMap = it));
  }

  keyupEvent($event: any) {
    console.log($event);
    switch ($event.key) {
      case 'k':
      case 'ArrowUp':
        this.access.top().subscribe(() => this.access.get().subscribe( it => this.fieldMap = it));
        break;
      case 'j':
      case 'ArrowDown':
        this.access.down().subscribe(() => this.access.get().subscribe( it => this.fieldMap = it));
        break;
      case 'l':
      case 'ArrowRight':
        this.access.right().subscribe(() => this.access.get().subscribe( it => this.fieldMap = it));
        break;
      case 'h':
      case 'ArrowLeft':
        this.access.left().subscribe(() => this.access.get().subscribe( it => this.fieldMap = it));
        break;
      default:
    }
  }
}
