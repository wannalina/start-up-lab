import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  constructor(private router: Router) {}

  navigateToGame(storyType: string) {
    this.router.navigate(['/game'], { queryParams: { story: storyType } });
  }
}