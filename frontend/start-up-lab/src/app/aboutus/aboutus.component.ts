import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.checkVisibility(); // Check visibility on load
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkVisibility(); // Check visibility on scroll
  }

  private checkVisibility(): void {
    const elements = this.el.nativeElement.querySelectorAll('.aboutus-content');
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }
}