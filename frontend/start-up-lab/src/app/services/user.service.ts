import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUserInfo(): { email: string; username: string; firstName: string; lastName: string; phoneNumber: string; address: string; role: string } | null {
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
        address: '123 Main St, Springfield, USA',
        role: 'User'
      };
    }

    return null; // No session, return null
  }
}