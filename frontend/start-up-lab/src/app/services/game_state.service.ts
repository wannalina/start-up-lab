import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
    private storyName = signal<string>('');
    private scoreSignal = signal<number>(0);
    private chosenCharacter = signal<string>('');

    get name() {
        return this.storyName.asReadonly();
    }

    get score() {
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

    updateScore(amount: number) {
        this.scoreSignal.set(this.scoreSignal() + amount);
    }

    resetScore() {
        this.scoreSignal.set(0);
    }
}