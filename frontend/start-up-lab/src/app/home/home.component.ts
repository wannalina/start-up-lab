import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private el: ElementRef, private router: Router) {}

  formData = {
    email: '',
  }


  ngOnInit(): void {
    this.checkVisibility(); // Check visibility on load
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkVisibility(); // Check visibility on scroll
  }

  private checkVisibility(): void {
    const elements = this.el.nativeElement.querySelectorAll('.home-section');
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }

  onSubscribe(event: Event, form: any): void {
    event.preventDefault();
    if (form.valid) {
      console.log('Subscribed with email:', this.formData.email);
      alert('Thank you for subscribing!');
      this.formData.email = ''; // Clear the input field
      form.resetForm(); // Reset the form state
    } else {
      console.error('Invalid email address');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToDemo() {
    this.router.navigate(['/game']);
  }

  navigateToService() {
    this.router.navigate(['/services']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}