import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { defaultStory } from '../../assets/stories/default-story';
import { adventureStory } from '../../assets/stories/test-story'; // Import the new story
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
  chosenCharacter: string = '';

  constructor(private gameStateService: GameStateService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const storyType = params['story'];
      if (storyType === 'default') {
        this.initStory(defaultStory);
      } else if (storyType === 'adventure') {
        this.initStory(adventureStory); // Initialize the new story
      } else {
        this.initStory(defaultStory); // Fallback to default story
      }
    });
  }

  initStory(story: any) {
    this.story = story;
    this.currentStory = this.story.start;
    // set story name signal
    this.gameStateService.setStoryName(this.story.name);
  }

  updateGameScore(next: string) {
    const selectedChoice = this.currentStory.choices?.find((choice: any) => choice.next === next);
    if (selectedChoice && selectedChoice.score) {
      const cumulativeScore = this.gameStateService.score() + selectedChoice.score;
      this.gameStateService.updateScore(cumulativeScore);
    }
  }

  makeChoice(choice: any, next: string) {
    // update choice score to determine report
    this.updateGameScore(next);

    // open the report if at the end of the game
    if (next === 'end') {
      setTimeout(() =>  {
        this.router.navigate(['/report']);
      }, 2000);
    }

    if (next === 'character') {
      this.gameStateService.setCharacter(choice.text);
    }

    // Update the current story based on the user's choice
    this.currentStory = this.story[next];

    // If there are no choices, auto-advance to the next story after 5 seconds
    if (!this.currentStory.choices && this.currentStory.next) {
      setTimeout(() => {
        this.makeChoice(this.currentStory.choice, this.currentStory.next);
      }, 2000); // 5 seconds delay
    }
  }
}