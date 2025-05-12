import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { GameStateService, GameSession } from '../services/game_state.service';
import { GameStateApi } from '../api/gameStateApi';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email: string = '';
  username: string = 'testuser';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '123-456-7890';
  storyName: string = '';
  address: string = '123 Main St, Springfield, USA';
  role: string = 'User';
  assignments: GameSession[] = [];
  paginatedAssignments: GameSession[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  isLoading: boolean = true;
  showPopup: boolean = false;
  showSessionPopup: boolean = false;
  showCreatePopup: boolean = false; // For create assignment popup
  selectedSession: GameSession | null = null;
  newAssignment: GameSession = { sessionID: '', title: '', storyName: '', candidateName: '', candidateEmail: '', candidatePhoneNumber: '', sessionLink: '' };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private gameStateService: GameStateService,
    private gameStateApi: GameStateApi
  ) {}

  async ngOnInit(): Promise<void> {
    const userInfo = await this.userService.getUserInfo();
    if (userInfo) {
      this.email = userInfo.email;
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      //this.phoneNumber = userInfo.phoneNumber;
      //this.role = userInfo.role;

      // Fetch assignments
      /*this.userService.getAssignments().pipe(delay(3000)).subscribe((data) => {
        this.assignments = data;
        this.totalPages = Math.ceil(this.assignments.length / this.itemsPerPage);
        this.updatePaginatedAssignments();
        this.isLoading = false;
      });*/

      const assignmentsList = await this.userService.getAssignments();
      this.assignments = assignmentsList;
      this.totalPages = Math.ceil(this.assignments.length / this.itemsPerPage);
      this.updatePaginatedAssignments();
      this.isLoading = false;
      
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

  viewSession(assignment: GameSession): void {
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
    this.newAssignment = { sessionID: '', title: '', storyName: '', candidateName: '', candidatePhoneNumber: '', candidateEmail: '', sessionLink: '' }; // Reset form
  }

  async createNewGame(assignment: GameSession): Promise<void> {
    try {
      const newGameSession: GameSession = {
        "sessionID": assignment.sessionID,
        "title": assignment.title,
        "candidateName": assignment.candidateName,
        "candidateEmail": assignment.candidateEmail,
        "candidatePhoneNumber": assignment.candidatePhoneNumber,
        "sessionLink": assignment.sessionLink,
        "storyName": assignment.storyName
      };
      
      await this.gameStateApi.createGameSession(newGameSession);
    } catch(error) {
      console.error(`Error creating new game session: ${error}`);
    }
  }

  async saveAssignment(): Promise<void> {
    let newId = '';

    if (this.assignments === undefined) {
      newId = (1).toString();
    } else {
      newId = (this.assignments.length + 1).toString();
    }
    this.gameStateService.setGameId(newId);

    this.newAssignment.sessionLink = await this.gameStateApi.getGameSessionLink(newId);

    this.newAssignment.sessionID = newId; 
    const newAssignment: GameSession = { ...this.newAssignment };

    // create new game session
    await this.createNewGame(newAssignment);

    this.assignments.push(newAssignment);
    this.updatePaginatedAssignments();
    this.closeCreatePopup();
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }

  copyToClipboard(sessionLink: any): void {
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