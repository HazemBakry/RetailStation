import { Component, OnInit } from '@angular/core';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-receipts',
  templateUrl: './payment-receipts.component.html',
  styleUrls: ['./payment-receipts.component.css']
})
export class PaymentReceiptsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سندات الصرف'];
  List: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private paymentService: PaymentService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetPaymentReceiptsSummary();
  }

  GetPaymentReceiptsSummary() {
    this.showLoader = true;
    this.paymentService.GetPaymentReceipts_Summary(this.FilterModel).subscribe(data => {
      this.List = data;

      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetPaymentReceiptsSummary();
  }

  CancelPaymentReceipt(receiptId: number) {
    debugger;
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

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}