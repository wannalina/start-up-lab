import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environment';
import { AuthService } from './auth.service';

interface User {
    email: string; 
    firstName: string; 
    lastName: string; 
    //phoneNumber: string; 
    //role: string 
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  jwtToken: string | null = '';

  constructor(private authService: AuthService) {}

  async getUserInfo(): Promise<User | null> {
    // Check if the session cookie exists
    const hasSession = document.cookie.split('; ').some((cookie) => cookie.startsWith('session='));
    this.jwtToken = this.authService.getJwtFromCookie('session');

    if (hasSession && this.jwtToken) {
      const response = await fetch(`${environment.serverApiUrl}/session-user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });
      const user = (await response.json()).message;
      return {
        'firstName': user[0].firstname,
        'lastName': user[0].lastname,
        'email': user[0].email
      };
    }
    return null; // No session, return null
  }

  getAssignments(): Observable<{ sessionID: string; title: string; candidateName: string; sessionLink: string }[]> {
    // Mock data
    const mockAssignments = [
      {
        sessionID: '1',
        title: 'Space Quiz (Personality Test)',
        candidateName: 'Alice Johnson',
        sessionLink: 'https://example.com/session/1'
      },
      {
        sessionID: '2',
        title: 'Adventure Quiz (Personality Test)',
        candidateName: 'Bob Smith',
        sessionLink: 'https://example.com/session/2'
      },
      {
        sessionID: '3',
        title: 'Science Quiz (Math Test)',
        candidateName: 'Charlie Brown',
        sessionLink: 'https://example.com/session/3'
      }
    ];
    return of(mockAssignments); // Simulate an observable response
  }
}