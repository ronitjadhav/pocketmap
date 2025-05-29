import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiInteractionService {
  private loginPanelTriggerSource = new Subject<void>();

  loginPanelTrigger$ = this.loginPanelTriggerSource.asObservable();

  triggerLoginPanel() {
    this.loginPanelTriggerSource.next();
  }
}
