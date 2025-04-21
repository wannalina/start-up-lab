import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    // Define the story structure
    this.story = {
      start: {
        text: 'You wake up in a mysterious forest. What do you do?',
        choices: [
          { text: 'Explore the forest', next: 'explore' },
          { text: 'Stay where you are', next: 'stay' }
        ]
      },
      explore: {
        text: 'You find a hidden path leading to a small village. What do you do?',
        choices: [
          { text: 'Enter the village', next: 'village' },
          { text: 'Turn back', next: 'start' }
        ]
      },
      stay: {
        text: 'You decide to stay put. Hours pass, and nothing happens. What do you do?',
        choices: [
          { text: 'Explore the forest', next: 'explore' },
          { text: 'Wait longer', next: 'end' }
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
  }

  makeChoice(next: string) {
    // Update the current story based on the user's choice
    this.currentStory = this.story[next];
  }
}