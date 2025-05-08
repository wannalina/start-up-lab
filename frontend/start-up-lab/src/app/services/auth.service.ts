import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkSessionCookie());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  login(): void {
    document.cookie = `session=mock-session-token; path=/; max-age=3600`; // Expires in 1 hour
    this.loggedIn.next(true);
  }

  logout(): void {
    document.cookie = `session=; path=/; max-age=0`; // Clear the session cookie
    this.loggedIn.next(false);
  }

  private checkSessionCookie(): boolean {
    return document.cookie.split('; ').some((cookie) => cookie.startsWith('session='));
  }
}
