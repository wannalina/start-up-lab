import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = '';
  //username: string = '';
  firstName: string = '';
  lastName: string = '';
  //phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private signupService: SignupService, private router: Router) {}

  ngOnInit(): void {}

  onSignup(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!this.email || !this.firstName || !this.lastName || !this.password || !this.confirmPassword) {  // add phone number
      this.errorMessage = 'All fields are required!';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Invalid email format!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long!';
      return;
    }
    /*
    if (!/^\d+$/.test(this.phoneNumber)) {
      this.errorMessage = 'Phone number must contain only digits!';
      return;
    } 

    if (this.phoneNumber.length < 10) {
      this.errorMessage = 'Phone number must be at least 10 digits long!';
      return;
    }

    if (this.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long!';
      return;
    } */
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    console.log('Signup Data:', {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      //phoneNumber: this.phoneNumber,
      password: this.password
    });

    this.signupService.signup({
      email: this.email,
      //username: this.username,
      firstname: this.firstName,
      lastname: this.lastName,
      //phoneNumber: this.phoneNumber,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });

    this.resetForm();
    this.errorMessage = ''; // Clear error message on successful signup
  }

  private resetForm(): void {
    this.email = '';
    //this.username = '';
    this.firstName = '';
    this.lastName = '';
    //this.phoneNumber = '';
    this.password = '';
    this.confirmPassword = '';
  }
}