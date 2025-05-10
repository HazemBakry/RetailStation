
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
import { ReceiveReceipt } from '../../models/GeneralAccounts/ReceiveReceipt';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-general-accounts-dashboard',
  templateUrl: './general-accounts-dashboard.component.html',
  styleUrls: ['./general-accounts-dashboard.component.css']
})
export class GeneralAccountsDashboardComponent implements OnInit {

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
  receiveReceiptsList: any[] = [];

  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  pagedResponse: PagedResponseDTO<OrderModel[]> = {
    currentPage: 1,
    pageSize: 5,
    results: [],
    filterList: []
  }
  PaymentReceipts: PagedResponseDTO<ReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };
  ReceiveReceipts: PagedResponseDTO<ReceiveReceipt[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };
  selectedTabName:string;
  constructor(private modalService: NgbModal,
    private route:ActivatedRoute,
    private datePipe: DatePipe,
    private generalAccountService: GeneralAccountService,
    private purchaseService: PurchaseService,
    private paymentService: PaymentService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['tabName']) {
        console.log(params['tabName']);
        this.selectedTabName=params['tabName'];
      }
    });
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
        this.toaster.success('تم ترحيل القيود بنجاح');
      }
      else
        this.toaster.error('حدث خطأ');

      this.showLoader = false;
    });
  }

  getPaymentReceiptsSummary() {
    //this.showLoader = true;
    this.paymentService.GetPaymentReceipts_Summary(this.FilterModel).subscribe(data => {
      this.PaymentReceipts.results = data.results;
      this.PaymentReceipts.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      //this.showLoader = false;
    }, err => {
      //this.showLoader = false;
    }, () => {
      //this.showLoader = false;
    });
  }

  getReceiveReceiptsSummary() {
    //this.showLoader = true;
    this.paymentService.GetReceiveReceipts_Summary(this.FilterModel).subscribe(data => {
      this.ReceiveReceipts.results = data.results;
      this.ReceiveReceipts.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      //this.showLoader = false;
    }, err => {
      //this.showLoader = false;
    }, () => {
      //this.showLoader = false;
    });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }
}

