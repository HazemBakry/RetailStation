import { Component, OnInit } from '@angular/core';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { HrService } from 'src/app/components/HR/services/hr.service';

@Component({
  selector: 'app-loans-requests',
  templateUrl: './loans-requests.component.html',
  styleUrls: ['./loans-requests.component.css']
})
export class LoansRequestsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'طلبات السلف'];
  showLoader: boolean;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10
  };

  LoanList: PagedResponseDTO<any[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private paymentService: PaymentService,
    private hrService: HrService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getLoansRequestsSummary();
  }

  getLoansRequestsSummary() {
    this.showLoader = true;
    this.hrService.GetAllEmployeeLoansData(this.FilterModel).subscribe(data => {
      this.LoanList.results = data.results;
      this.LoanList.totalCount = data.totalCount;
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
    this.getLoansRequestsSummary();
  }

  CancelPaymentReceipt(receiptId: number) {
    this.paymentService.CancelPaymentReceipt(receiptId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء السند بنجاح');
        this.getLoansRequestsSummary();
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
        this.getLoansRequestsSummary();
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

}