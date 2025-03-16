import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateReportsService } from '../Services/create-reports.service';
import { SearchReportModel } from '../Models/ReportParams';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {
  ReportParams: SearchReportModel = {} as SearchReportModel;
  private stopPolling = new Subject<void>();
  ContentData: any[] = [];
  jsonData: any = {};
  ContentHeaderData = [];
  // FooterData = [
  //   { featureName: 'أجمالي دائن', featureValue: 0 },
  //   { featureName: 'أجمالي مدين', featureValue: 5280 }
  // ];
  NewFooterArry: any[] = [];
  FromDate: string;
  ToDate: string;


  constructor(private reportService: CreateReportsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ReportParams.ControllerName = params['controllerName'];
      this.ReportParams.ApiName = params['apiName'];
      this.ReportParams.MethodType = params['methodType'];
      this.ReportParams.companyName = params['companyName'];
      this.ReportParams.pageName = params['pageName'];
      this.ReportParams.sectionName = params['sectionName'];
      this.route.queryParams.subscribe(queryParams => {
        if (queryParams['fromDate'] && queryParams['toDate']) {
          this.FromDate = queryParams['fromDate'];
          this.ToDate = queryParams['toDate'];
        }
        this.ReportParams.filterItems = [];
        for (let key in queryParams)
          this.ReportParams.filterItems.push({ categoryName: key, itemFlag: queryParams[key] });

        this.startTokenCheck();
      });
    });
  }

  GetCreateReportData() {
    this.reportService.GetCreateReportData(this.ReportParams).subscribe(data => {
      this.ContentData = data.results;
      this.GetReportJsonKeys();
      this.NewFooterArry = [];
      // if (this.FooterData.every(x => x.featureValue == 0))
      //   this.NewFooterArry = [];
      // else
      //   for (let i = 0; i < this.FooterData.length; i += 2)
      //     this.NewFooterArry.push(this.FooterData.slice(i, i + 2));
    });
  }

  startTokenCheck() {
    interval(1000).pipe(takeUntil(this.stopPolling)).subscribe(() => {
      const token = localStorage.getItem('JWT_TOKEN');
      if (token) {
        this.GetCreateReportData();
        this.stopPolling.next();
      }
    });
  }

  GetReportJsonKeys() {
    this.reportService.GetReportJsonKeys().subscribe(data => {
      this.jsonData = data;
      this.ContentHeaderData = this.getSectionData(this.ReportParams.sectionName);
    });
  }

  getSectionData(section: string) {
    if (!this.jsonData[section]) return [];
    return Object.entries(this.jsonData[section]).map(([propKey, propDisName]) => ({
      propKey,
      propDisName
    }));
  }

  ngOnDestroy() {
    this.stopPolling.next();
    this.stopPolling.complete();
  }
}
