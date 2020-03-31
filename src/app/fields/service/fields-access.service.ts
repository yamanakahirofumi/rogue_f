import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FieldsAccessService {

  constructor(private httpClient: HttpClient) {
  }

  get() {
    return this.httpClient.get<Array<Array<string>>>('/api/fields/main');
  }

  start() {
    return this.httpClient.post('/api/player/hero', {});
  }

  top() {
    return this.httpClient.put('/api/player/hero/command/top', {});
  }

  down() {
    return this.httpClient.put('/api/player/hero/command/down', {});
  }

  right() {
    return this.httpClient.put('/api/player/hero/command/right', {});
  }

  left() {
    return this.httpClient.put('/api/player/hero/command/left', {});
  }

  pickUp(){
    return this.httpClient.put('/api/player/hero/command/pickup', {});
  }
}
