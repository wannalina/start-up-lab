import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { defaultStory } from '../../assets/stories/default-story';
import { adventureStory } from '../../assets/stories/test-story'; // Import the new story
import { GameStateService } from '../services/game_state.service';
import { Router } from '@angular/router';
import { GameStateApi } from '../api/gameStateApi';

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
  gameId: string | '' = '';

  constructor(private gameStateService: GameStateService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private gameStateApi: GameStateApi) {}

  ngOnInit() {
    const gameId = this.route.snapshot.queryParams['session-id'];
    this.gameStateService.setGameId(gameId || '');

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

  updateGameScores(choice: any) {
    if (choice && choice.scores) {
      this.gameStateService.updateScores(choice.scores);
    }
  }

  async makeChoice(choice: any, next: string) {
    // update choice score to determine report
    this.updateGameScores(choice);

    // open the report if at the end of the game
    if (next === 'end') {
      const reportId = await this.gameStateApi.getReportId(this.gameStateService.name(), this.gameStateService.scores(), this.gameStateService.gameId());
      this.gameStateService.setReportId(reportId);
      setTimeout(() =>  {
        this.router.navigate([`/report/${this.gameStateService.reportId()}`]);
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
      }, 3000); // 5 seconds delay
    }
  }
}