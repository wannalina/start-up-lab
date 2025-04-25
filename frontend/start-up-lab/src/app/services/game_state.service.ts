import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
    private storyName = signal<string>('');
    private scoreSignal = signal<number>(0);

    get name() {
        return this.storyName.asReadonly();
    }

    get score() {
        return this.scoreSignal.asReadonly();
    }

    setStoryName(name: string) {
        console.log("name:", name);
        this.storyName.set(name);
    }

    resetStoryName() {
        this.storyName.set('');
    }

    updateScore(amount: number) {
        this.scoreSignal.set(this.scoreSignal() + amount);
    }

    resetScore() {
        this.scoreSignal.set(0);
    }
}