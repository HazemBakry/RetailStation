import { Component, OnInit } from '@angular/core';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentReceipt } from '../../models/GeneralAccounts/PaymentReceipt';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-payment-orders',
  templateUrl: './payment-orders.component.html',
  styleUrls: ['./payment-orders.component.css']
})
export class PaymentOrdersComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أوامر الصرف'];
  showLoader: boolean;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  ReceiptList: PagedResponseDTO<PaymentReceipt[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  constructor(private paymentService: PaymentService,
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

  CancelPaymentReceipt(receiptId: number) {
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

}