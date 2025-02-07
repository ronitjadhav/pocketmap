import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { IdleService } from './idle.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  pb: PocketBase;
  currentUser: any = null;
  // Reactive observable to signal login state changes.
  currentUser$ = new BehaviorSubject<any>(null);

  constructor(private idleService: IdleService) {
    this.pb = new PocketBase('http://127.0.0.1:8090');
    if (this.pb.authStore.isValid) {
      this.currentUser = this.pb.authStore.model;
      this.currentUser$.next(this.currentUser);
      // Start idle watching if a session is restored.
      this.idleService.startWatching(() => this.logout());
    }
  }

  async login(email: string, password: string): Promise<any> {
    const authData = await this.pb.collection('users').authWithPassword(email, password);
    this.currentUser = authData.record;
    this.currentUser$.next(this.currentUser);
    // Start idle watching—if inactive for 5 minutes, the user is logged out.
    this.idleService.startWatching(() => this.logout());
    return authData;
  }

  logout() {
    this.pb.authStore.clear();
    this.currentUser = null;
    this.currentUser$.next(null);
    this.idleService.stopWatching();
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
