import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { AuthService } from '../services/auth.service';
import { GameSession } from '../services/game_state.service';

@Injectable({ providedIn: 'root' })
export class GameStateApi {

    constructor(private authService: AuthService) {}

    async createGameSession(jsonBody: GameSession): Promise<void> {
        try {
            const res = await fetch(`${environment.serverApiUrl}/create-game-session`, {
                method: 'POST',
                headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.authService.getJwtFromCookie('session')}`
                }, 
                body: JSON.stringify(jsonBody)
            });
            const gameSessionId = await res.json();
        } catch(error) {
            console.error(`Error occurred in createGameSession: ${error}`);
        }
    }

    async getGameSessionLink(gameSessionId: string): Promise<string> {
        try {
            const res = await fetch(`${environment.serverApiUrl}/get-session-link`, {
                method: 'POST',
                headers: {
                "Content-Type": "application/json"
                }, 
                body: JSON.stringify({'session-id': gameSessionId})
            });
            const gameSessionLink = await res.json();
            return gameSessionLink;
        } catch(error) {
            console.error(`Error occurred in getGameSessionLink: ${error}`);
            return '';
        }
    }

    async getGameSessionsForUser(): Promise<GameSession[] | null> {
        try {
            const res = await fetch(`${environment.serverApiUrl}/get-sessions-for-user`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authService.getJwtFromCookie('session')}`
                }
            });
            const gameSessionsList = (await res.json()).message;
            return gameSessionsList;
        } catch(error) {
            console.error(`Error occurred in getGameSessionsForUser: ${error}`);
            return null;
        }
    }
}