import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FieldsAccessService {

  constructor(private httpClient: HttpClient) {
  }

  get(userId: string) {
    return this.httpClient.get<DisplayData[]>(`/api/fields/${userId}/now`);
  }

  getDungeonInfo(userId: string): Observable<DungeonInfo> {
    return this.httpClient.get<DungeonInfo>(`api/fields/${userId}/info`);
  }

  private command(userId: string, command: string): Observable<any> {
    return this.httpClient.put<{ [name: string]: boolean }>(`/api/player/${userId}/command/${command}`, {});
  }

  top(userId: string) {
    return this.command(userId, 'top');
  }

  down(userId: string) {
    return this.command(userId, 'down');
  }

  right(userId: string) {
    return this.command(userId, 'right');
  }

  left(userId: string) {
    return this.command(userId, 'left');
  }

  downStairs(userId: string) {
    return this.command(userId, 'downStairs');
  }

  upStairs(userId: string) {
    return this.command(userId, 'upStairs');
  }

  exist(name: string) {
    return this.httpClient.get<boolean>(`/api/user/name/${name}/exist`);
  }

  create(name: string): Observable<string> {
    return this.httpClient.post(`/api/user/name/${name}`, {}, {responseType: 'text'});
  }

  getPlayerInfo(userId: string) {
    return this.httpClient.get<Player>(`/api/player/${userId}`);
  }

  gotoDungeon(userId: string): Observable<any> {
    return this.httpClient.post(`/api/player/${userId}/command/dungeon/default`, {});
  }

  pickUp(userId: string): Observable<PickUpResult> {
    return this.command(userId, 'pickup');
  }

  attack(userId: string): Observable<CombatResult> {
    return this.command(userId, 'attack');
  }

  search(userId: string): Observable<SearchResult> {
    return this.command(userId, 'search');
  }

  disarm(userId: string): Observable<DisarmResult> {
    return this.command(userId, 'disarm');
  }

  wait(userId: string): Observable<any> {
    return this.command(userId, 'wait');
  }
}
