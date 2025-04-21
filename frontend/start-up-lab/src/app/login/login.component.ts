import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  onLogin(event: Event) {
    event.preventDefault();

    // Mock login validation
    if (this.email === 'test@example.com' && this.password === 'password') {
      // Store session cookie
      document.cookie = `session=mock-session-token; path=/; max-age=3600`; // Expires in 1 hour
      alert('Login successful!');
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}