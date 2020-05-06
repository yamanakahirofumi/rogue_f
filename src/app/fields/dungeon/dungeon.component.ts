import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FieldsAccessService} from '../service/fields-access.service';
import {Observable, of} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
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
  dungeon: string;
  level: number;
  comment: string;
  @ViewChild('outer') outer: ElementRef;

  constructor(private access: FieldsAccessService, private storage: StorageService) {
  }

  ngOnInit(): void {
    this.id = Number(this.storage.get('playerId'));
    this.name = this.storage.get('playerName');
    this.comment = '';
    this.access.getDungeonInfo(this.id).subscribe(it => this.setDungeonInfo(it));
    this.access.get(this.id).subscribe(it => this.fieldMap = it);
  }

  ngAfterViewInit(): void {
    this.outer.nativeElement.focus();
  }

  private setDungeonInfo(mapSet) {
    this.level = mapSet.level;
    this.dungeon = mapSet.name;
  }

  keyupEvent(event: any) {
    console.log(event);
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
    ob.pipe(mergeMap(() => this.access.get(this.id)))
      .subscribe(it => this.fieldMap = it);
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
