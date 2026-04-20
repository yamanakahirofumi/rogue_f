import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlayerDomain} from "../d/player-domain";
import {FieldsAccessService} from "../services/fields-access.service";
import {SseFieldService} from "../services/sse-field.service";
import {StorageService} from "../services/storage.service";
import {filter, from, mergeMap, mergeMapTo, Observable, of, tap} from "rxjs";
import {IntervalService} from "../services/interval.service";

@Component({
    selector: 'app-dungeon',
    templateUrl: './dungeon.component.html',
    styleUrls: ['./dungeon.component.css'],
    standalone: false
})
export class DungeonComponent implements OnInit {

  fieldMap!: string[][];
  player!: PlayerDomain;
  dungeon!: string;
  statusChangeFlg!: boolean;
  level!: number;
  comment!: string;
  @ViewChild('outer') outer!: ElementRef;

  constructor(private access: FieldsAccessService,
              private sse: SseFieldService,
              private storage: StorageService,
              private interval: IntervalService) {
    this.fieldMap = [];
  }

  ngOnInit(): void {
    const playerId = this.storage.get('playerId');
    of(playerId)
      .pipe(mergeMap(it => this.access.getPlayerInfo(it)))
      .subscribe(it => {
        this.player = new PlayerDomain(it)
        // 自然回復は10秒(1ティック)ごと
        this.interval.getTimer(10).subscribe(() => {
          this.player.recover();
          this.player.minusSatiety(1); // 10秒ごとに満腹度を 1 減少
          this.statusChangeFlg = true;
          setTimeout(() => this.statusChangeFlg = false, 100);
        })
      });
    this.comment = '';
    this.statusChangeFlg = false;
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

  private setDungeonInfo(mapSet: DungeonInfo) {
    this.level = mapSet.level;
    this.dungeon = mapSet.name;
  }

  keyupEvent(event: KeyboardEvent) {
    const actionConfig = this.getActionConfig(event.key);
    if (!actionConfig) return;

    from([event.key]).pipe(
      filter(() => this.player.isAction()),
      tap(() => {
        this.player.action(actionConfig.baseInterval, actionConfig.staminaCost);
        this.statusChangeFlg = true;
      }),
      mergeMap(it => this.execKeyEvent(it)),
      mergeMapTo(this.access.get(this.player.getId())),
      mergeMap(from)
    ).subscribe(it => {
      this.setField(it);
      this.statusChangeFlg = false
    });
  }

  private getActionConfig(key: string): { baseInterval: number, staminaCost: number } | null {
    switch (key) {
      case 'k': case '8': case 'ArrowUp':
      case 'j': case '2': case 'ArrowDown':
      case 'l': case '6': case 'ArrowRight':
      case 'h': case '4': case 'ArrowLeft':
        return { baseInterval: 0.5, staminaCost: 1 };
      case 'a':
        return { baseInterval: 1.0, staminaCost: 2 };
      case 'g':
        return { baseInterval: 0.5, staminaCost: 0 };
      case 's':
      case 'd':
        return { baseInterval: 1.2, staminaCost: 1 };
      case '<':
      case '>':
        return { baseInterval: 1.0, staminaCost: 0 };
      case '.':
        return { baseInterval: 0.5, staminaCost: 0 };
      default:
        return null;
    }
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
      case 'h':
      case '4':
      case 'ArrowLeft':
        return this.access.left(this.player.getId());
      case 'a':
        return this.access.attack(this.player.getId());
      case 'g':
        return this.access.pickUp(this.player.getId())
          .pipe(tap(it => {
            this.comment = this.pickupComment(it);
          }));
      case 's':
        return this.access.search(this.player.getId());
      case 'd':
        return this.access.disarm(this.player.getId());
      case '<':
        return this.access.upStairs(this.player.getId());
      case '>':
        return this.access.downStairs(this.player.getId());
      case '.':
        return this.access.wait(this.player.getId());
      default:
        return of('a');
    }
  }

  private pickupComment(resultSet: PickUpResult): string {
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
