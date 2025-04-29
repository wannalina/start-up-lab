import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email: string = 'test@example.com';
  username: string = 'testuser';
  firstName: string = 'John';
  lastName: string = 'Doe';
  phoneNumber: string = '123-456-7890';
  address: string = '123 Main St, Springfield, USA';
  role: string = 'User';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch user data here if needed
  }

  onLogout(): void {
    this.authService.logout(); // Clear session and update login state
    this.router.navigate(['/login']); // Redirect to login page
  }
}