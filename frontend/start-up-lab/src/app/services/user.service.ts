import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUserInfo(): { email: string; username: string; firstName: string; lastName: string; phoneNumber: string; role: string } | null {
    // Check if the session cookie exists
    const hasSession = document.cookie.split('; ').some((cookie) => cookie.startsWith('session='));

    if (hasSession) {
      // Mock user data
      return {
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        role: 'User'
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