import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO, PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';
import { FinanceWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { PaymentReceiptModel } from 'src/app/components/Shared/models/PaymentReceiptModel';


@Component({
  selector: 'app-merchant-invoices',
  templateUrl: './merchant-invoices.component.html',
  styleUrls: ['./merchant-invoices.component.css']
})
export class MerchantInvoicesComponent implements OnInit {
  TitleList = ['Merchant','Payment Receipts'];
  showLoader: boolean;
  pageResponseModel: PagedResponseModel<PaymentReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  public wfStatus = FinanceWorkflowStatus;
  constructor(private merchantService: MerchantService,
    private offcanvasService: NgbOffcanvas,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetPaymentReceipts_Data();
  }

  GetPaymentReceipts_Data() {
    this.showLoader = true;
    this.merchantService.GetPaymentReceipts_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      this.pageResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.GetPaymentReceipts_Data();
  }

  cancelPaymentReceipt(receiptId: number) {
    this.merchantService.CancelPaymentReceipt(receiptId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.GetPaymentReceipts_Data();
      }
      else {
        this.toaster.error(data.message);
      }
    }, (error) => {
      this.toaster.error('error');
    })
  }
}