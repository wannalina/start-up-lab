import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor() {}

  signup(userData: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
  }): Observable<{ message: string }> {
    // Mock backend response
    if (userData.email === 'test@example.com') {
      // Simulate an error if the email is already taken
      return throwError(() => new Error('Email is already registered')).pipe(delay(1000));
    }

    // Simulate a successful signup response
    return of({ message: 'Signup successful!' }).pipe(delay(1000));
  }
}