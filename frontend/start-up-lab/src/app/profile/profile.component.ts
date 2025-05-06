import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { delay }  from 'rxjs/operators';

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
  assignments: { sessionID: string; title: string; candidateName: string; sessionLink: string }[] = [];
  paginatedAssignments: { sessionID: string; title: string; candidateName: string; sessionLink: string }[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  isLoading: boolean = true;
  showPopup: boolean = false;
  showSessionPopup: boolean = false;
  showCreatePopup: boolean = false; // For create assignment popup
  selectedSession: { sessionID: string; title: string; candidateName: string; sessionLink: string } | null = null;
  newAssignment: { title: string; candidateName: string; sessionLink: string } = { title: '', candidateName: '', sessionLink: '' };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userInfo = this.userService.getUserInfo();
    if (userInfo) {
      this.email = userInfo.email;
      this.username = userInfo.username;
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.phoneNumber = userInfo.phoneNumber;
      this.role = userInfo.role;

      // Fetch assignments
      this.userService.getAssignments().pipe(delay(3000)).subscribe((data) => {
        this.assignments = data;
        this.totalPages = Math.ceil(this.assignments.length / this.itemsPerPage);
        this.updatePaginatedAssignments();
        this.isLoading = false;
      });
    } else {
      // If no session, redirect to login
      this.router.navigate(['/login']);
    }
  }

  updatePaginatedAssignments(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAssignments = this.assignments.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAssignments();
    }
  }

  viewSession(assignment: { sessionID: string; title: string; candidateName: string; sessionLink: string }): void {
    this.selectedSession = assignment;
    this.showSessionPopup = true;
  }

  closeSessionPopup(): void {
    this.showSessionPopup = false;
    this.selectedSession = null;
  }

  onLogout(): void {
    this.authService.logout(); // Clear session and update login state
    this.router.navigate(['/login']); // Redirect to login page
  }

  onCreateAssignment(): void {
    this.showCreatePopup = true;
  }

  closeCreatePopup(): void {
    this.showCreatePopup = false;
    this.newAssignment = { title: '', candidateName: '', sessionLink: '' }; // Reset form
  }

  saveAssignment(): void {
    const newId = (this.assignments.length + 1).toString();
    const newAssignment = { sessionID: newId, ...this.newAssignment };
    this.assignments.push(newAssignment);
    this.updatePaginatedAssignments();
    this.closeCreatePopup();
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }

  copyToClipboard(sessionLink: string): void {
    navigator.clipboard.writeText(sessionLink).then(
      () => {
        alert('Session link copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy session link: ', err);
      }
    );
  }
}