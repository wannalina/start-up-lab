import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to login state changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (this.isLoggedIn) {
        const userInfo = this.userService.getUserInfo();
        this.username = userInfo?.username || ''; // Fetch username from user info
      } else {
        this.username = '';
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  profileClicked() {
    this.router.navigate(['/profile']);
  }
  
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
