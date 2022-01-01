import {Injectable, NgZone} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SseFieldService {

  private eventSource!: EventSource

  constructor(private zone: NgZone) {
  }

  openGet(userId: string): Observable<DisplayData> {
    return new Observable(observer => {
      this.eventSource = new EventSource(`/api/fields/${userId}`);
      this.eventSource.onmessage = ev => {
        this.zone.run(() => {
          observer.next(JSON.parse(ev.data));
        });
      };
    });
  }

  close() {
    this.eventSource.close();
  }
}
