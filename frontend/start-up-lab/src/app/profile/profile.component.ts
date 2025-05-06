import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
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
  assignments: string[] = [];
  showPopup: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  
  ngOnInit(): void {
    const userInfo = this.userService.getUserInfo();
    if (userInfo) {
      this.email = userInfo.email;
      this.username = userInfo.username;
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.phoneNumber = userInfo.phoneNumber;
      this.address = userInfo.address;
      this.role = userInfo.role;
    } else {
      // If no session, redirect to login
      this.router.navigate(['/login']);
    }
  }

  onLogout(): void {
    this.authService.logout(); // Clear session and update login state
    this.router.navigate(['/login']); // Redirect to login page
  }

  onCreateAssignment(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }
}