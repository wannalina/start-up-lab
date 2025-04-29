import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login state changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
