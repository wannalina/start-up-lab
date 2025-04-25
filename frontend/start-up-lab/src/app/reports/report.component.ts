import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { firstValueFrom } from 'rxjs';
import { GameStateService } from '../services/game_state.service';

@Component({
    selector: 'app-report',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    storyName: string = this.gameStateService.name();
    selectedReportName: string = '';
    report: any = {};
    finalScore: number = this.gameStateService.score();

    constructor(private http: HttpClient, private gameStateService: GameStateService) {}

    async ngOnInit() {
        this.selectedReportName = await this.getReportName();
        this.report = await this.loadReport();
    }

    // function to fetch report name based on story name
    async getReportName() {
        // fetch report name to display
        console.log("score:", this.finalScore);
        const response = (await fetch(`${environment.serverApiUrl}/get-report?storyName=${this.storyName}&score=${this.finalScore}`));
        this.selectedReportName = await response.text();
        return this.selectedReportName;
    }

    // function to load report data based on game and report names
    async loadReport(): Promise<Object | undefined>  {
        // path to report json files
        const reportUrl = `../../assets/reports/${this.storyName}/${this.selectedReportName}.json`;
        this.report = await firstValueFrom(this.http.get(reportUrl));
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
