import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { FinanceWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-orders',
  templateUrl: './payment-orders.component.html',
  styleUrls: ['./payment-orders.component.css']
})
export class PaymentOrdersComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أوامر الصرف'];
  showLoader: boolean=false;
  showDetailsLoader: boolean=false;
  public wfStatus = FinanceWorkflowStatus;

  pagedResponseModel: PagedResponseDTO<ReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  paymentOrderDetailsModel: ReceiptModel;
  constructor(private paymentService: PaymentService,
    private offcanvasService: NgbOffcanvas,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getPaymentOrdersSummary();
  }

  getPaymentOrdersSummary() {
    this.showLoader = true;
    this.paymentService.GetPaymentOrders_Summary(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPaymentOrdersSummary();
  }

  CancelPaymentReceipt(receiptId: number) {
    this.paymentService.CancelPaymentReceipt(receiptId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء أمر الصرف بنجاح');
        this.getPaymentOrdersSummary();
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
        this.toaster.success('تم الغاء أمر الصرف بنجاح');
        this.getPaymentOrdersSummary();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الإلغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الإلغاء');
    })
  }

  cancelPaymentOrder(paymentOrderId: number) {
    this.paymentService.CancelPaymentOrderById(paymentOrderId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء أمر الصرف بنجاح');
        this.getPaymentOrdersSummary();
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
  @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;

  openSidePanel(paymentOrderId: number, content: any = null) {
    this.paymentOrderDetailsModel = null;
    this.getPaymentOrderDetailsById(paymentOrderId);
    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  getPaymentOrderDetailsById(paymentOrderId) {
    this.showDetailsLoader = true;
    this.paymentService.GetPaymentOrderDetailsById(paymentOrderId).subscribe((data: ReceiptModel) => {
      this.paymentOrderDetailsModel = data;
      console.log('Payment Order Details:', this.paymentOrderDetailsModel);
      
      this.showDetailsLoader = false;
    }, err => {
      this.showDetailsLoader = false;
    }, () => {
      this.showDetailsLoader = false;
    });
  }
}