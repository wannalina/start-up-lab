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
        image: 'assets/images/forest.jpg',
        choices: [
          { text: 'Explore the forest', next: 'explore' },
          { text: 'Stay where you are', next: 'stay' }
        ]
      },
      explore: {
        text: 'You find a hidden path leading to a small village. What do you do?',
        image: 'assets/images/village.jpg',
        choices: [
          { text: 'Enter the village', next: 'imageOnly' },
          { text: 'Turn back', next: 'start' }
        ]
      },
      stay: {
        text: 'You decide to stay put. Hours pass, and nothing happens. What do you do?',
        image: null,
        choices: [
          { text: 'Explore the forest', next: 'explore' },
          { text: 'Wait longer', next: 'imageOnly' }
        ]
      },
      imageOnly: {
        text: null, // No text for this story
        image: 'assets/images/mystery.jpg', // Only an image is displayed
        choices: null, // No choices for this story
        next: 'end' // Automatically proceed to the next story
      },
      village: {
        text: 'The villagers welcome you and offer you food. You have found safety. The end.',
        image: 'assets/images/safety.jpg',
        choices: null,
        next: 'end'
      },
      end: {
        text: 'You waited too long, and night fell. The forest became dangerous. The end.',
        image: 'assets/images/danger.jpg',
        choices: null
      }
    };

    // Initialize the story at the starting point
    this.currentStory = this.story.start;
  }

  makeChoice(next: string) {
    this.currentStory = this.story[next];

    // If there are no choices, auto-advance to the next story after 5 seconds
    if (!this.currentStory.choices && this.currentStory.next) {
      setTimeout(() => {
        this.makeChoice(this.currentStory.next);
      }, 5000); // 5 seconds delay
    }
  }
}