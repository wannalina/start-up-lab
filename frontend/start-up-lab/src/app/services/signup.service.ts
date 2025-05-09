import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../../environment';

export interface UserData {
  email: string;
  //username: string;
  firstname: string;
  lastname: string;
  //phoneNumber: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(private httpClient: HttpClient) {}

  signup(userData: UserData): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(
      `${environment.serverApiUrl}/sign-up`,
      userData,
      { observe: 'response' }
    ).pipe(
      map(response => {
        if (response.status === 201) {
          return { message: 'Signup successful!' };
        } else {
          throw new Error('Signup failed');
        }
      }),
      catchError(err => {
        return throwError(() => new Error('Signup failed, please try again...'));
      }),
      delay(1000)
    );
  }
}