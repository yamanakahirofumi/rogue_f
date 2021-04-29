import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';
import {from, Observable, of} from 'rxjs';
import {mergeMap, mergeMapTo, tap} from 'rxjs/operators';
import {StorageService} from '../service/storage.service';
import {SseFieldService} from '../service/sse-field.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit, OnDestroy, AfterViewInit {

  fieldMap: string[][];
  private id: number;
  name: string;
  dungeon: string;
  level: number;
  comment: string;
  @ViewChild('outer') outer: ElementRef;

  constructor(private access: FieldsAccessService,
              private sse: SseFieldService,
              private storage: StorageService) {
    this.fieldMap = [];
  }

  ngOnInit(): void {
    this.id = Number(this.storage.get('playerId'));
    this.name = this.storage.get('playerName');
    this.comment = '';
    this.access.getDungeonInfo(this.id).subscribe(it => this.setDungeonInfo(it));
    this.sse.openGet(this.id).subscribe(it => this.setField(it));
  }

  ngAfterViewInit(): void {
    this.outer.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.sse.close();
  }

  private setField(it: DisplayData): void {
    for (let i = it.position.x; i < it.data.length; i++) {
      if (!this.fieldMap[it.position.y]) {
        this.fieldMap[it.position.y] = [];
      }
      this.fieldMap[it.position.y][i] = it.data[i];
    }
  }

  private setDungeonInfo(mapSet) {
    this.level = mapSet.level;
    this.dungeon = mapSet.name;
  }

  keyupEvent(event: any) {
    const ob: Observable<object> = (() => {
      switch (event.key) {
        case 'k':
        case '8':
        case 'ArrowUp':
          return this.access.top(this.id);
        case 'j':
        case '2':
        case 'ArrowDown':
          return this.access.down(this.id);
        case 'l':
        case '6':
        case 'ArrowRight':
          return this.access.right(this.id);
        // case 'y':
        //   return this.access.
        case 'h':
        case '4':
        case 'ArrowLeft':
          return this.access.left(this.id);
        case 'g':
          return this.access.pickUp(this.id).pipe(tap(it => this.comment = this.pickupComment(it)));
        case '<':
          return this.access.upStairs(this.id);
        case '>':
          return this.access.downStairs(this.id);
        default:
          return of('a');
      }
    })();
    ob.pipe(
      mergeMapTo(this.access.get(this.id)),
      mergeMap(it => from(it)))
      .subscribe(it => this.setField(it));
  }

  private pickupComment(resultSet): string {
    console.log(resultSet);

    if (resultSet.result && resultSet.type === 1) {
      return resultSet.gold + 'G取得しました';
    } else if (resultSet.result && resultSet.type === 2) {
      return resultSet.itemName + 'を取得しました';
    } else if (resultSet.message === 'NoObjectOnTheFloor') {
      return '床に物は落ちていません';
    } else if (resultSet.message === '') {
      return '';
    } else {
      return '取得に失敗しました';
    }
  }
}
