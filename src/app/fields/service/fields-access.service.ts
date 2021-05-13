import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FieldsAccessService {

  constructor(private httpClient: HttpClient) {
  }

  get(userId: number) {
    return this.httpClient.get<DisplayData[]>(`/api/fields/${userId}/now`);
  }

  getDungeonInfo(userId: number) {
    return this.httpClient.get<{[name: string]: string}>(`api/fields/${userId}/info`);
  }

  private command(userId: number, command: string) {
    return this.httpClient.put<{[name: string]: boolean}>(`/api/player/${userId}/command/${command}`, {});
  }

  top(userId: number) {
    return this.command(userId, 'top');
  }

  down(userId: number) {
    return this.command(userId, 'down');
  }

  right(userId: number) {
    return this.command(userId, 'right');
  }

  left(userId: number) {
    return this.command(userId, 'left');
  }

  downStairs(userId: number) {
    return this.command(userId, 'downStairs');
  }

  upStairs(userId: number) {
    return this.command(userId, 'upStairs');
  }

  exist(name: string) {
    return this.httpClient.get<boolean>(`/api/user/name/${name}/exist`);
  }

  create(name: string) {
    return this.httpClient.post<number>(`/api/user/name/${name}`, {});
  }

  gotoDungeon(userId: number) {
    return this.httpClient.post(`/api/player/${userId}`, {});
  }

  pickUp(userId: number) {
    return this.command(userId, 'pickup');
  }
}
