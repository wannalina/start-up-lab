import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../services/game_state.service';
import { CommonModule } from '@angular/common';
import { GameStateApi } from '../api/gameStateApi';
import { ActivatedRoute } from '@angular/router';

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
    reportId: string = '';

    constructor(private gameStateService: GameStateService, private gameStateApi: GameStateApi, private route: ActivatedRoute) {}

    async ngOnInit() {
        this.reportId = this.route.snapshot.paramMap.get('report-id') || '';
        this.gameStateService.setReportId(this.reportId);
        this.report = await this.getReport();
    }

    // function to fetch report by report ID
    async getReport(): Promise<Report> {
        try {
            if (this.gameStateService.reportId() === "demo") {
                this.report = await this.gameStateApi.getDemoReport(this.storyName, this.finalScores);
            } else {
                this.report = await this.gameStateApi.getReportById(this.gameStateService.reportId());
                await this.gameStateApi.sendReportEmail(this.gameStateService.gameId());
            }
            this.gameStateService.resetSignals();
            return this.report;
        } catch(error) {
            console.error(`Error occurred in getReport: ${error}`);
            return {} as Report;
        }
    }

    // function to convert report json object to string
    formatJsonObject(jsonObject: Object): string {
        const key = Object.keys(jsonObject)[0];
        const value = (jsonObject as any)[key];
        const objectToString = `${key}: ${value}`;
        return objectToString;
    }
}
