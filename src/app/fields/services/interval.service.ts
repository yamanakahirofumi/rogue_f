import {Injectable} from '@angular/core';
import {bufferCount, interval, Observable, repeatWhen, share, Subject, take, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IntervalService {

  private interval$: Observable<number>;
  private readonly sub$: Subject<string>;

  constructor() {
    this.sub$ = new Subject();
    this.interval$ = interval(1000).pipe(
      take(1000),
      tap({
        next: n => console.log(n + ":" + new Date()),
        complete: () => this.sub$.next('')
      }),
      repeatWhen(() => this.sub$),
      share());
  }

  getTimer(n: number): Observable<number[]> {
    return this.interval$.pipe(bufferCount(n));
  }

}
