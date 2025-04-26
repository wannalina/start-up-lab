import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
    private storyName = signal<string>('');
    private chosenCharacter = signal<string>('');
    private scoreSignal = signal<{ [key: string]: number }>({
        Leader: 0,
        Collaborator: 0,
        Analyst: 0
    });

    get name() {
        return this.storyName.asReadonly();
    }

    get scores() {
        return this.scoreSignal.asReadonly();
    }

    get character() {
        return this.chosenCharacter.asReadonly();
    }

    setStoryName(name: string) {
        this.storyName.set(name);
    }

    resetStoryName() {
        this.storyName.set('');
    }

    setCharacter(characterName: string) {
        // format character name
        let formattedChar = (characterName.toLowerCase()).replace(/\s+/g, '_');
        this.chosenCharacter.set(formattedChar);
    }

    resetCharacter() {
        this.chosenCharacter.set('');
    }

    updateScores(newScores: { [key: string]: number }) {
        const currentScores = this.scoreSignal();
        const updatedScores = { ...currentScores };

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
}