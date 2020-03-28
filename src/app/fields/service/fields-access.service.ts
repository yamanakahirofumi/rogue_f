import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldsAccessService {

  constructor(private httpClient: HttpClient) {
  }

  get() {
    return this.httpClient.get<Array<Array<string>>>('/api/fields/main');
  }
}
