import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FieldsAccessService {

  constructor(private httpClient: HttpClient) {
  }

  get(userId: number) {
    return this.httpClient.get<Array<Array<string>>>(`/api/fields/${userId}`);
  }

  getDungeonInfo(userId: number){
    return this.httpClient.get(`api/fields/${userId}/info`);
  }

  private command(userId: number, command: string) {
    return this.httpClient.put(`/api/player/${userId}/command/${command}`, {});
  }

  top(userId: number) {
    return this.httpClient.put(`/api/player/${userId}/command/top`, {});
  }

  down(userId: number) {
    return this.httpClient.put(`/api/player/${userId}/command/down`, {});
  }

  right(userId: number) {
    return this.httpClient.put(`/api/player/${userId}/command/right`, {});
  }

  left(userId: number) {
    return this.httpClient.put(`/api/player/${userId}/command/left`, {});
  }

  downStairs(userId: number){
    return this.httpClient.put(`/api/player/${userId}/command/downStairs`, {});
  }

  upStairs(userId: number){
    return this.httpClient.put(`/api/player/${userId}/command/upStairs`, {});
  }

  exist(name: string) {
    return this.httpClient.get<boolean>(`/api/user/name/${name}/exist`);
  }

  create(name: string) {
    return this.httpClient.post<number>(`/api/user/${name}`, {});
  }

  gotoDungeon(userId: number) {
    return this.httpClient.post(`/api/player/${userId}`, {});
  }

  pickUp(userId: number) {
    return this.httpClient.put(`/api/player/${userId}/command/pickup`, {});
  }
}
