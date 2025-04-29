import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'start-up-lab';
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Check if the session cookie exists
    this.isLoggedIn = document.cookie.split('; ').some((cookie) => cookie.startsWith('session='));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
