import { Component, OnInit } from '@angular/core';
import { SearchReportModel } from '../Models/ReportParams';
import { interval, Subject, takeUntil } from 'rxjs';
import { CreateReportsService } from '../Services/create-reports.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../Shared/services/shared.service';

@Component({
  selector: 'app-payment-receipts-report',
  templateUrl: './payment-receipts-report.component.html',
  styleUrls: ['./payment-receipts-report.component.css']
})
export class PaymentReceiptsReportComponent implements OnInit {
  ReportParams: SearchReportModel = {} as SearchReportModel;
  StopPolling = new Subject<void>();
  ContentData: any;
  TodayDate: Date = new Date();
  RenderPage = 0;

  constructor(private reportService: CreateReportsService, private sharedService: SharedService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ReportParams.ControllerName = params['controllerName'];
      this.ReportParams.ApiName = params['apiName'];
      this.ReportParams.MethodType = params['methodType'];
      this.ReportParams.pageName = params['pageName'];
      this.route.queryParams.subscribe(queryParams => {
        this.ReportParams.filterItems = [];
        for (let key in queryParams)
          this.ReportParams.filterItems.push({ categoryName: key, itemFlag: queryParams[key] });

        this.startTokenCheck();
      });
    });
  }

  GetCreateReportData() {
    this.reportService.GetCreateReportData(this.ReportParams).subscribe(data => {
      this.ContentData = data;
      this.GetArabicEnglishNumberText();
      this.RenderPage++;
    });
  }

  startTokenCheck() {
    interval(1000).pipe(takeUntil(this.StopPolling)).subscribe(() => {
      const token = localStorage.getItem('JWT_TOKEN');
      if (token) {
        this.GetCreateReportData();
        this.StopPolling.next();
      }
    });
  }

  GetArabicEnglishNumberText() {
    return this.sharedService.GetArabicEnglishNumberText(this.ReportParams.filterItems[0].itemFlag).subscribe(data => {
      this.ContentData.descAr = data?.descAr;
      this.ContentData.descEn = data?.descEn;
      this.RenderPage++;
    })
  }

  ngOnDestroy() {
    this.StopPolling.next();
    this.StopPolling.complete();
  }
}
