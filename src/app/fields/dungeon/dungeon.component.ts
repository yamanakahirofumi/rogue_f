import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {StorageService} from '../service/storage.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit, AfterViewInit {

  fieldMap: string[][];
  private id: number;
  name: string;
  @ViewChild('outer') outer: ElementRef;

  constructor(private access: FieldsAccessService, private storage: StorageService) {
  }

  ngOnInit(): void {
    this.id = Number(this.storage.get('playerId'));
    this.name = this.storage.get('playerName');
    this.access.get(this.id).subscribe(it => this.fieldMap = it);
  }

  ngAfterViewInit(): void {
    this.outer.nativeElement.focus();
  }


  keyupEvent(event: any) {
    console.log(event);
    const ob: Observable<object> = (() => {
      switch (event.key) {
        case 'k':
        case 'ArrowUp':
          return this.access.top(this.id);
        case 'j':
        case 'ArrowDown':
          return this.access.down(this.id);
        case 'l':
        case 'ArrowRight':
          return this.access.right(this.id);
        // case 'y':
        //   return this.access.
        case 'h':
        case 'ArrowLeft':
          return this.access.left(this.id);
        case 'g':
          return this.access.pickUp(this.id);
        default:
          return of('a');
      }
    })();
    ob.pipe(mergeMap(() => this.access.get(this.id)))
      .subscribe(it => this.fieldMap = it);
  }
}
