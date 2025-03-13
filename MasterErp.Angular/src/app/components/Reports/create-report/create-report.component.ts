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
  ContentHeaderData = [
    { propKey: 'accountNumber', propDisName: 'الكـود' },
    { propKey: 'nameAR', propDisName: 'الحســاب' },
    { propKey: 'preDebit', propDisName: 'رصيد ما قبل (مدين)' },
    { propKey: 'preCredit', propDisName: 'رصيد ما قبل (دائن)' },
    { propKey: 'debit', propDisName: 'الحركة (مدين)' },
    { propKey: 'credit', propDisName: 'الحركة (دائن)' },
    { propKey: 'totalDebit', propDisName: 'الإجمالى (مدين)' },
    { propKey: 'totalCredit', propDisName: 'الإجمالى (دائن)' },
  ];
  FooterData = [
    { featureName: 'أجمالي دائن', featureValue: 0 },
    { featureName: 'أجمالي مدين', featureValue: 5280 }
  ];
  NewFooterArry: any[] = [];
  ImgSrc: string;
  FromDate: string;
  ToDate: string;


  constructor(private reportService: CreateReportsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ImgSrc = "D:/Salam/ssss/MasterErp/MasterErp.Angular/src/assets/images/av-4.png";
    this.route.params.subscribe(params => {
      this.ReportParams.ControllerName = params['controllerName'];
      this.ReportParams.ApiName = params['apiName'];
      this.ReportParams.MethodType = params['methodType'];
      this.ReportParams.companyName = params['companyName'];
      this.ReportParams.pageName = params['pageName'];
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
      this.NewFooterArry = [];
      if (this.FooterData.every(x => x.featureValue == 0))
        this.NewFooterArry = [];
      else
        for (let i = 0; i < this.FooterData.length; i += 2)
          this.NewFooterArry.push(this.FooterData.slice(i, i + 2));
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

  ngOnDestroy() {
    this.stopPolling.next();
    this.stopPolling.complete();
  }
}
