import {Component, OnInit} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

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
    const ob: Observable<object> = (() => {
      switch ($event.key) {
        case 'k':
        case 'ArrowUp':
          return this.access.top();
        case 'j':
        case 'ArrowDown':
          return this.access.down();
        case 'l':
        case 'ArrowRight':
          return this.access.right();
        case 'h':
        case 'ArrowLeft':
          return this.access.left();
        case 'g':
          return this.access.pickUp();
        default:
          return of('a');
      }
    })();
    ob.pipe(mergeMap(() => this.access.get()))
      .subscribe(it => this.fieldMap = it);
  }
}
