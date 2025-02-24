import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PaymentService } from '../../services/payment.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';

@Component({
  selector: 'app-general-accounts-home',
  templateUrl: './general-accounts-home.component.html',
  styleUrls: ['./general-accounts-home.component.css']
})
export class GeneralAccountsHomeComponent implements OnInit {


  overviewList = [
    {
      title: 'سجل القيود',
      number: 574.12,
      status: 'مقارنة بالاسبوع الماضى',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 427,
      statusBgClass: 'bg-primary-gradient'
    },
    {
      title: 'القيود المرحلة',
      number: 180,
      status: 'القيود المرحلة',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 523,
      statusBgClass: 'bg-success-gradient'
    },
    {
      title: 'القيود المعلقة',
      number: -12,
      status: 'مقارنة بالامس',
      statusIcon: 'fa-arrow-circle-down',
      subscribers: 312,
      statusBgClass: 'bg-danger-gradient'
    },
    {
      title: 'سندات الصرف',
      number: 993.74,
      status: 'مقارنة بأخر 10 أيام',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 12,
      statusBgClass: 'bg-warning-gradient'
    },
    {
      title: 'سندات القبض',
      number: 486,
      status: 'مقارنة بالشهر الماضى',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 150,
      statusBgClass: 'bg-secondary-gradient'
    },
  ];

  statsList = [
    {
      title: 'Orders Received',
      icon: 'uil-shopping-cart-alt',
      number: 486,
      orderName: 'Completed Orders',
      orderNumber: 351,
    },
    {
      title: 'Total Sales',
      icon: 'uil-tag-alt',
      number: 1641,
      orderName: 'This Month',
      orderNumber: 216,
    },
    {
      title: 'Revenue',
      icon: 'uil-repeat',
      number: '$42,562',
      orderName: 'This Month',
      orderNumber: '$5,032',
    },
    {
      title: 'Total Profit',
      icon: 'uil uil-award',
      number: '$9,562',
      orderName: 'This Month',
      orderNumber: '$542',
    },
  ];

  statisticsCardList: any[] = [];
  orders = []
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  activeFilter: number;
  FromDate = new Date();
  ToDate = new Date();
  branchId = 0;
  SalesSummaryStatistics: any;
  showLoader: boolean = false;
  journalEntriesList: any[] = [];
  purchasesInvoicesList: any[] = [];
  paymentReceiptsList: any[] = [];
  receiveReceiptsList: any[] = [];
  filterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  }

  pagedResponse: PagedResponseDTO<OrderModel[]> = {
    currentPage: 1,
    pageSize: 5,
    results: [],
    filterList: []
  }

  constructor(private modalService: NgbModal,
    private datepipe: DatePipe,
    private generalAccountService: GeneralAccountService,
    private purchaseService: PurchaseService,
    private paymentService: PaymentService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getGeneralAccountsStatistics();
    //this.getSalesSummary();
    this.getDailyJournalEntriesSummary();
    //this.getPurchaseInvoicesData();
    this.getPaymentReceiptsSummary();
    this.getReceiveReceiptsSummary();
  }

  getGeneralAccountsStatistics() {
    this.generalAccountService.GetGeneralAccounts_Statistics().subscribe(data => {
      this.statisticsCardList = data;
    },
      (error) => { console.log("error", error); }, () => { });
  }

  getSalesSummary() {
    // let FromDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd');
    // let ToDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd');
    // this.AdminService.GetSalesSummary(FromDate,ToDate,this.branchId).subscribe(data => {
    //   this.SalesSummaryStatistics = data[0];
    // });
  }
  // Modal Function
  closeResultModal = '';
  openModal(content: any) {
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' })
  }

  getDailyJournalEntriesSummary() {
    this.generalAccountService.GetDailyJournalEntriesSummary(this.pagedResponse).subscribe(data => {
      this.journalEntriesList = data?.results;
    },
      (error) => {
        console.log("error", error);
      },
      () => { });
  }

  cancelJournalEntry(journalEntryId: number) {
    let journalEntryIds = [];
    journalEntryIds.push(journalEntryId);
    this.showLoader = true;
    this.generalAccountService.CancelJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.getDailyJournalEntriesSummary();
        this.getGeneralAccountsStatistics();
        this.toaster.success('تم اسقاط القيود بنجاح');
      }
      else
        this.toaster.error('حدث خطأ');
      this.showLoader = false;
    });
  }

  postJournalEntry(journalEntryId: number) {
    let journalEntryIds = [];
    journalEntryIds.push(journalEntryId);
    this.showLoader = true;
    this.generalAccountService.PostJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.getDailyJournalEntriesSummary();
        this.toaster.success('تم ترحيل القيوم بنجاح');
      }
      else
        this.toaster.error('حدث خطأ');

      this.showLoader = false;
    });
  }

  getPurchaseInvoicesData() {
    // this.showLoader=true;
    this.purchaseService.GetPurchaseInvoices_Data(this.pagedResponse).subscribe(data => {
      this.purchasesInvoicesList = data.results;

    }, (err) => {
      // this.showLoader=false;
    }, () => {
      // this.showLoader=false;
    })
  }

  getPaymentReceiptsSummary() {
    // this.showLoader = true;
    this.paymentService.GetPaymentReceipts_Summary(this.filterModel).subscribe(data => {
      this.paymentReceiptsList = data;

    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }

  getReceiveReceiptsSummary() {
    this.paymentService.GetReceiveReceipts_Summary(this.filterModel).subscribe(data => {
      this.receiveReceiptsList = data;

    }, (err) => {
      // this.showLoader=false;
    }, () => {
      // this.showLoader=false;
    })
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }
}

