import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-report',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    storyName: string = 'gameOne'; //! placeholder until game component supports this
    selectedReportName: string = '';
    report: any = {};

    constructor(private http: HttpClient) {}

    async ngOnInit() {
        this.selectedReportName = await this.getReportName();
        this.report = await this.loadReport();
    }

    // function to fetch report name based on story name
    async getReportName() {
        // fetch report name to display
        this.selectedReportName = await (await fetch(`${environment.serverApiUrl}/get-report?storyName=${this.storyName}`)).text();
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
