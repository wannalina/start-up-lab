import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { AuthService } from './auth.service';
import { GameStateApi } from '../api/gameStateApi';
import { GameSession } from './game_state.service';

interface User {
    userId: number;
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

  constructor(private authService: AuthService, private gameStateApi: GameStateApi) {}

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
        'userId': user.id,
        'firstName': user.firstname,
        'lastName': user.lastname,
        'email': user.email
      };
    }
    return null; // No session, return null
  }

  async getAssignments(): Promise<GameSession[]> {
    const gameSessionList = await this.gameStateApi.getGameSessionsForUser();
    if (gameSessionList === null) {
      return [];
    }
    return gameSessionList;
  }
}