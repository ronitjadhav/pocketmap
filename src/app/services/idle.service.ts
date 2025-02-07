import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleSubscription: Subscription | null = null;
  private idleTimeoutMillis: number = 300000; // 5 minutes

  constructor(private zone: NgZone) {}

  /**
   * Start watching for user activity.
   * If no activity occurs within idleTimeoutMillis, onIdle is called.
   */
  startWatching(onIdle: () => void) {
    this.stopWatching();
    // Run outside Angular to avoid triggering change detection on every event.
    this.zone.runOutsideAngular(() => {
      const mousemove$ = fromEvent(document, 'mousemove');
      const keydown$ = fromEvent(document, 'keydown');
      const click$ = fromEvent(document, 'click');
      const scroll$ = fromEvent(document, 'scroll');
      const touchstart$ = fromEvent(document, 'touchstart');
      const activity$ = merge(mousemove$, keydown$, click$, scroll$, touchstart$);

      this.idleSubscription = activity$.pipe(
        // Reset the timer on each activity event.
        switchMap(() => timer(this.idleTimeoutMillis)),
        tap(() => {
          // When timer fires, run the idle callback inside Angular zone.
          this.zone.run(() => onIdle());
        })
      ).subscribe();
    });
  }

  stopWatching() {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
      this.idleSubscription = null;
    }
  }
}
