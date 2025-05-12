import { Injectable, signal } from '@angular/core';

export interface GameSession {
    sessionID: string; 
    title: string; 
    candidateName: string; 
    sessionLink: string;
    storyName?: string;
    candidateEmail: string;
    candidatePhoneNumber: string; 
};

@Injectable({ providedIn: 'root' })
export class GameStateService {

    constructor() {}

    private storyName = signal<string>('');
    private chosenCharacter = signal<string>('');
    private scoreSignal = signal<{ [key: string]: number }>({
        Leader: 0,
        Collaborator: 0,
        Analyst: 0
    });
    private id = signal<string | null>(null);

    get name() {
        return this.storyName.asReadonly();
    }

    get scores() {
        return this.scoreSignal.asReadonly();
    }

    get character() {
        return this.chosenCharacter.asReadonly();
    }

    get gameId() {
        return this.id.asReadonly();
    }

    setStoryName(name: string) {
        this.storyName.set(name);
    }

    resetStoryName() {
        this.storyName.set('');
    }

    setCharacter(characterName: string) {
        // format character name (replace spaces with underscore)
        let formattedChar = (characterName.toLowerCase()).replace(/\s+/g, '_');
        this.chosenCharacter.set(formattedChar);
    }

    setGameId(gameId: string | null) {
        this.id.set(gameId);
    }

    resetCharacter() {
        this.chosenCharacter.set('');
    }

    updateScores(newScores: { [key: string]: number }) {
        const currentScores = this.scoreSignal();
        const updatedScores = { ...currentScores };

        // add score to relevant fields
        for (const key in newScores) {
            if (updatedScores.hasOwnProperty(key)) {
                updatedScores[key] += newScores[key];
            }
        }

        this.scoreSignal.set(updatedScores);
    }

    resetScores() {
        this.scoreSignal.set({
            Leader: 0,
            Collaborator: 0,
            Analyst: 0
        });
    }

    resetGameId() {
        this.id.set(null);
    }
}