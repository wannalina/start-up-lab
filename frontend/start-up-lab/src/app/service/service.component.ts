import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.checkVisibility(); // Check visibility on load
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkVisibility(); // Check visibility on scroll
  }

  private checkVisibility(): void {
    const elements = this.el.nativeElement.querySelectorAll('.service-demo');
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }

  navigateToGame(storyType: string) {
    this.router.navigate(['/game', `${storyType}-story`], { queryParams: { "session-id": "demo" } });
  }
}