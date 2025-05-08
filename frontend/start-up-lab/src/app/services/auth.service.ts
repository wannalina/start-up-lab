import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment';

interface UserData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkSessionCookie());
  isLoggedIn$ = this.loggedIn.asObservable();
  jwtToken: string = '';

  constructor() {}

  async login(email: string, password: string): Promise<void> {
    const userData: UserData = {
      email: email,
      password: password
    };
    try {
      // send POST request to login user
      const response = await fetch(`${environment.serverApiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      this.jwtToken = (await response.json()).message;

      // set browser cookie
      document.cookie = `session=${this.jwtToken}; path=/; max-age=3600;SameSite=Strict;`; // HttpOnly // Expires in 1 hour
      this.loggedIn.next(true);
    } catch(error) {
      console.error(`Error logging in: ${error}`)
    }
  }

  logout(): void {
    document.cookie = `session=; path=/; max-age=0`; // Clear the session cookie
    this.loggedIn.next(false);
  }

  private checkSessionCookie(): boolean {
    return document.cookie.split('; ').some((cookie) => cookie.startsWith('session='));
  }
}
