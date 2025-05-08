import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  onLogin(event: Event) {
    event.preventDefault();

    // Mock login validation
    if (this.email === 'test@example.com' && this.password === 'password') {
      this.authService.login(); // Update login state
      alert('Login successful!');
      this.errorMessage = '';

      this.router.navigate(['/profile']); // Redirect to profile page after successful login
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }

  onLogout(): void {
    this.authService.logout(); // Clear session and update login state
    this.router.navigate(['/login']); // Redirect to login page
  }
}