import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { defaultStory } from '../../assets/stories/default-story';
import { adventureStory } from '../../assets/stories/test-story'; // Import the new story

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

  constructor(private route: ActivatedRoute) {}

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
  }

  makeChoice(next: string) {
    this.currentStory = this.story[next];

    // If there are no choices, auto-advance to the next story after 5 seconds
    if (!this.currentStory.choices && this.currentStory.next) {
      setTimeout(() => {
        this.makeChoice(this.currentStory.next);
      }, 3000); // 3 seconds delay
    }
  }
}