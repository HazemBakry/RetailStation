import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../GeneralAccounts/services/general-account.service';
import { FilterModel } from '../../Shared/models/FilterModel';
import { PurchaseService } from '../../Purchases/services/purchase.service';
import { PaymentService } from '../../GeneralAccounts/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { OrderModel } from '../../Inventory/models/inventory';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  overviewList = [
    {
      title: 'عدد الطلبات',
      number: 574.12,
      status: 'مقارنة بالاسبوع الماضى',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 427,
      statusBgClass: 'bg-primary-gradient'
    },
    {
      title: 'إجمالى المبيعات',
      number: 1230.17,
      status: 'مقارنة بالعام الماضى',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 523,
      statusBgClass: 'bg-success-gradient'
    },
    {
      title: 'الطلبات الملغية',
      number: -12,
      status: 'مقارنة بالامس',
      statusIcon: 'fa-arrow-circle-down',
      subscribers: 312,
      statusBgClass: 'bg-danger-gradient'
    },
    {
      title: 'الطلبات المعلقة',
      number: 993.74,
      status: 'مقارنة بأخر 10 أيام',
      statusIcon: 'fa-arrow-circle-up',
      subscribers: 12,
      statusBgClass: 'bg-warning-gradient'
    },
    {
      title: 'الطلبات المنتهية',
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

  orders = []
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  activeFilter: number;
  FromDate = new Date();
  ToDate = new Date();
  branchId = 0;
  SalesSummaryStatistics: any;
  showLoader:boolean=false;
  journalEntriesList:any[]=[];
  purchasesInvoicesList:any[]=[];
  paymentReceiptsList:any[]=[];
  receiveReceiptsList:any[]=[];
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 5,
    filterItems: []
  }
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  constructor(private modalService: NgbModal,
              private datepipe: DatePipe,
              private generalAccountService:GeneralAccountService,
              private purchaseService:PurchaseService,
              private paymentService:PaymentService,
              private toaster:ToastrService) { }

  ngOnInit(): void {
    this.GetSalesSummary();
    this.GetDailyJournalEntriesSummary();
    this.getPurchaseInvoicesData();
    this.GetPaymentReceiptsSummary();
    this.GetReceiveReceiptsSummary();
  }

  GetSalesSummary() {
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

  
  GetDailyJournalEntriesSummary() {
    this.generalAccountService.GetDailyJournalEntriesSummary(this.FilterModel).subscribe(data => {
        // console.log("🚀  ~ data:", data)
        this.journalEntriesList=data;
    },
    (error) => {
      console.log("error",error);
      
    },
    () => {});
  }
  CancelJournalEntry(journalEntryId:number) {
    let journalEntryIds =[];
    journalEntryIds.push(journalEntryId);
    this.showLoader = true;
    this.generalAccountService.CancelJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.GetDailyJournalEntriesSummary();
        this.toaster.success('تم اسقاط القيود بنجاح');
      }
      else
        this.toaster.error('حدث خطأ');
      this.showLoader = false;
    });
  }

  PostJournalEntry(journalEntryId:number) {
    let journalEntryIds =[];
    journalEntryIds.push(journalEntryId);
    this.showLoader = true;
    this.generalAccountService.PostJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.GetDailyJournalEntriesSummary();
        this.toaster.success('تم ترحيل القيوم بنجاح');
      }
      else
        this.toaster.error('حدث خطأ');

      this.showLoader = false;
    });
  }

  getPurchaseInvoicesData() {
    // this.showLoader=true;
    this.purchaseService.GetPurchaseInvoices_Data(this.pagedResponseModel).subscribe(data => {
      this.purchasesInvoicesList = data.results;
      
    },(err)=>{
      // this.showLoader=false;
    },()=>{
      // this.showLoader=false;
    })
  }
  GetPaymentReceiptsSummary() {
    // this.showLoader = true;
    this.paymentService.GetPaymentReceipts_Summary(this.FilterModel).subscribe(data => {
      this.paymentReceiptsList = data;
      
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }

  GetReceiveReceiptsSummary() {
    // this.showLoader=true;
    this.paymentService.GetReceiveReceipts_Summary(this.FilterModel).subscribe(data => {
      this.receiveReceiptsList = data;

    },(err)=>{
      // this.showLoader=false;
    },()=>{
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
