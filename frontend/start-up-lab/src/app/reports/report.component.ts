import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { GameStateService } from '../services/game_state.service';
import { CommonModule } from '@angular/common';

class Report {
    name?: string;
    image?: string;
    overview?: string;
    traits?: { [key: string]: string }[];
    strengths?: string;
    challenges?: string;
    recommendations?: string[];
    questions?: string[];
}

@Component({
    selector: 'app-report',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnInit {
    storyName: string = this.gameStateService.name();
    report: Report = new Report();
    finalScores: Object = this.gameStateService.scores();

    constructor(private http: HttpClient, private gameStateService: GameStateService) {}

    async ngOnInit() {
        this.report = await this.getReport();
    }

    // function to reset signals after end of game
    resetSignals() {
        this.gameStateService.resetCharacter();
        this.gameStateService.resetScores();
        this.gameStateService.resetStoryName();
    }

    // function to fetch report name based on story name
    async getReport(): Promise<Report> {
        // fetch report name to display
        const encodedScores = encodeURIComponent(JSON.stringify(this.finalScores));
        const response = (await fetch(`${environment.serverApiUrl}/get-report?storyName=${this.storyName}&score=${encodedScores}`));
        this.report = await response.json();

        this.resetSignals();
        return this.report;
    }

    // function to convert report json object to string
    formatJsonObject(jsonObject: Object): string {
        const key = Object.keys(jsonObject)[0];
        const value = (jsonObject as any)[key];
        const objectToString = `${key}: ${value}`;
        return objectToString;
    }
}
