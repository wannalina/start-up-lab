import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
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

  onSubscribe(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(`Subscribed email: ${this.formData.email}`); // Print the email to the console
    alert(`Thank you for subscribing to our newsletter, ${this.formData.email}`); 
    this.formData.email = ''; // Clear the email input field
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}