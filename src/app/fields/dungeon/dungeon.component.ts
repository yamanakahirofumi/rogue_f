import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlayerDomain} from "../d/player-domain";
import {FieldsAccessService} from "../services/fields-access.service";
import {SseFieldService} from "../services/sse-field.service";
import {StorageService} from "../services/storage.service";
import {filter, from, interval, mergeMap, mergeMapTo, Observable, of, take, tap} from "rxjs";

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {

  fieldMap!: string[][];
  player!: PlayerDomain;
  actionGage!: number;
  dungeon!: string;
  level!: number;
  comment!: string;
  @ViewChild('outer') outer!: ElementRef;

  constructor(private access: FieldsAccessService,
              private sse: SseFieldService,
              private storage: StorageService) {
    this.fieldMap = [];
  }

  ngOnInit(): void {
    const playerId = this.storage.get('playerId');
    of(playerId)
      .pipe(mergeMap(it => this.access.getPlayerInfo(it)))
      .subscribe(it => this.player = new PlayerDomain(it.id, it.name));
    this.comment = '';
    this.actionGage = 100;
    this.access.getDungeonInfo(playerId).subscribe(it => this.setDungeonInfo(it));
    this.sse.openGet(playerId).subscribe(it => this.setField(it));
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

  private setDungeonInfo(mapSet: any) {
    this.level = mapSet.level;
    this.dungeon = mapSet.name;
  }

  keyupEvent(event: any) {
    from([event.key]).pipe(
      filter(() => this.player.isAction()),
      tap(() => {
        this.player.action();
        this.actionGage = 0;
        interval(1000).pipe(take(this.player.getActionGageRecoveryTimes()))
          .subscribe(() => {
            this.actionGage = Math.min(this.actionGage + this.player.getActionGageRecoveryValue(), 100);
          });
      }),
      mergeMap(it => this.execKeyEvent(it)),
      mergeMapTo(this.access.get(this.player.getId())),
      mergeMap(from)
    ).subscribe(it => this.setField(it));
  }

  private execKeyEvent(key: string): Observable<any> {
    switch (key) {
      case 'k':
      case '8':
      case 'ArrowUp':
        return this.access.top(this.player.getId());
      case 'j':
      case '2':
      case 'ArrowDown':
        return this.access.down(this.player.getId());
      case 'l':
      case '6':
      case 'ArrowRight':
        return this.access.right(this.player.getId());
      // case 'y':
      //   return this.access.
      case 'h':
      case '4':
      case 'ArrowLeft':
        return this.access.left(this.player.getId());
      case 'g':
        return this.access.pickUp(this.player.getId())
          .pipe(tap(it => {
            this.comment = this.pickupComment(it);
          }));
      case '<':
        return this.access.upStairs(this.player.getId());
      case '>':
        return this.access.downStairs(this.player.getId());
      default:
        return of('a');
    }
  }

  private pickupComment(resultSet: any): string {
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
