import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseFieldService {

  private eventSource;

  constructor(private _zone: NgZone) {
  }

  openGet(userId: number): Observable<DisplayData> {
    return new Observable(observer => {
      this.eventSource = new EventSource(`/api/fields/${userId}`);
      this.eventSource.onmessage = ev => {
        this._zone.run(() => {
        observer.next(JSON.parse(ev.data));
      }); };
    });
  }

  close() {
    this.eventSource.close();
  }
}
