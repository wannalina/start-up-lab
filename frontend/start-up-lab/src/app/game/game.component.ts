import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game_state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  story: any;
  currentStory: any;

  constructor(private gameStateService: GameStateService, private router: Router) {}

  ngOnInit() {
    // Define the story structure
    this.story = {
      name: 'gameOne',
      start: {
        text: 'You wake up in a mysterious forest. What do you do?',
        choices: [
          { text: 'Explore the forest', next: 'explore', score: 1 },
          { text: 'Stay where you are', next: 'stay', score: 2 }
        ]
      },
      explore: {
        text: 'You find a hidden path leading to a small village. What do you do?',
        choices: [
          { text: 'Enter the village', next: 'village', score: 1 },
          { text: 'Turn back', next: 'start' , score: 2 }
        ]
      },
      stay: {
        text: 'You decide to stay put. Hours pass, and nothing happens. What do you do?',
        choices: [
          { text: 'Explore the forest', next: 'explore', score: 1 },
          { text: 'Wait longer', next: 'end', score: 2 }
        ]
      },
      village: {
        text: 'The villagers welcome you and offer you food. You have found safety. The end.',
        choices: null
      },
      end: {
        text: 'You waited too long, and night fell. The forest became dangerous. The end.',
        choices: null
      }
    };

    // Initialize the story at the starting point
    this.currentStory = this.story.start;
    // set story name signal
    this.gameStateService.setStoryName(this.story.name);
  }

  updateGameScore(next: string) {
    const selectedChoice = this.currentStory.choices.find((choice: any) => choice.next === next);
    const cumulativeScore = this.gameStateService.score() + selectedChoice.score;
    if (selectedChoice.score) {
      this.gameStateService.updateScore(cumulativeScore);
    }
  }

  makeChoice(next: string) {
    // update choice score to determine report
    this.updateGameScore(next);

    // open the report if at the end of the game
    if (next === 'end') {
      setTimeout(() =>  {
        this.router.navigate(['/report']);
      }, 2000);
    }

    // Update the current story based on the user's choice
    this.currentStory = this.story[next];
  }
}