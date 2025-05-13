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
            const gameSessionLink =(await res.json()).message;
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

    // function to get report ID
    async getReportId(storyName: string, finalScores: any, gameId: string): Promise<any> {
        try {
            const encodedScores = encodeURIComponent(JSON.stringify(finalScores));
            const res = await fetch(`${environment.serverApiUrl}/get-report-id?storyName=${storyName}&score=${encodedScores}&gameId=${gameId}`);
            const reportId = (await res.json()).message;
            return reportId;
        } catch(error) {
            console.error(`Error occurred in getReportId: ${error}`);
            return null;
        }
    }

    // function to get report ID from game
    async getReportById(reportId: string) {
        try {
            const res = await fetch(`${environment.serverApiUrl}/show-report?report-id=${reportId}`);
            const report = (await res.json()).message;
            return report;
        } catch(error) {
            console.error(`Error occurred in getReportById: ${error}`);
            return null;
        }
    }

    async sendReportEmail(gameId: string): Promise<boolean> {
        try {
            const res = await fetch(`${environment.serverApiUrl}/send-email`, {
                method: 'POST',
                headers: {
                "Content-Type": "application/json"
                }, 
                body: JSON.stringify({'game-id': gameId})
            });
            const isSuccessfulSend = (await res.json()).ok;
            return isSuccessfulSend;
        } catch(error) {
            console.error(`Error occurred in sendReportEmail: ${error}`);
            return false;
        }
    }
}