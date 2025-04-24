import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
    selector: 'app-report',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    storyName: string = 'gameOne';
    selectedReportName: string = '';
    report: any;

    constructor(private http: HttpClient) {}

    async ngOnInit() {
        this.selectedReportName = await this.getReportName();
        this.report = this.loadReport();
    }

    // function to fetch report name based on story name
    async getReportName() {
        this.selectedReportName = await (await fetch(`${environment.serverApiUrl}/get-report?storyName=${this.storyName}`)).text();
                        //.then(response => response.json());

        console.log("report name:", this.selectedReportName);
        return this.selectedReportName;
    }

    // function to load report data based on game and report names
    async loadReport() {
        const reportUrl = `../../assets/reports/${this.storyName}/${this.selectedReportName}.json`;
        this.report = await this.http.get(reportUrl).toPromise();
        console.log("Report:", this.report);
        return this.report;
    }

    formatJsonLists() {

    }
}
