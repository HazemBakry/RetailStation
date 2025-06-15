import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';

@Component({
  selector: 'app-payment-receipts',
  templateUrl: './payment-receipts.component.html',
  styleUrls: ['./payment-receipts.component.css']
})
export class PaymentReceiptsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سندات الصرف'];
  showLoader: boolean;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10
  };
  
  ReceiptList: PagedResponseDTO<ReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private paymentService: PaymentService, private ReportsService: CreateReportsService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetPaymentReceiptsSummary();
  }

  GetPaymentReceiptsSummary() {
    this.showLoader = true;
    this.paymentService.GetPaymentReceipts_Summary(this.FilterModel).subscribe(data => {
      this.ReceiptList.results = data.results;
      this.ReceiptList.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetPaymentReceiptsSummary();
  }

  cancelPaymentReceipt(receiptId: number) {
    this.paymentService.CancelPaymentReceipt(receiptId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء السند بنجاح');
        this.GetPaymentReceiptsSummary();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الإلغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الإلغاء');
    })
  }

  openJournalEntry(entryId: number) {
    this.paymentService.CancelPaymentReceipt(entryId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء السند بنجاح');
        this.GetPaymentReceiptsSummary();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الإلغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الإلغاء');
    })
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

  PrintData(paymentReceiptId: any) {
    let reportParams: SearchReportModel = {} as SearchReportModel;
    let filterItems: FilterItem[] = [
      { categoryName: 'PaymentReceiptId', itemFlag: paymentReceiptId }
    ];
    reportParams.ControllerName = 'Payment';
    reportParams.ApiName = 'GetPaymentReceiptDetailsById';
    reportParams.MethodType = 'GET';
    reportParams.pageName = 'payment-receipts-report';
    reportParams.isLandScape = true;
    reportParams.filterItems = filterItems;
    this.showLoader = true;
    this.ReportsService.CreateGeneralReport(reportParams, (timeTaken) => {
      this.showLoader = false;
      console.log(`Generate Report Request Time: ${timeTaken} S`);
    });
  }

}