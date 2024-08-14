import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/components/GeneralAccounts/services/payment.service';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css']
})
export class HrHomeComponent implements OnInit {

  // overviewList = [
  //   {
  //     title: 'عدد الطلبات',
  //     number: 574.12,
  //     status: 'مقارنة بالاسبوع الماضى',
  //     statusIcon: 'fa-arrow-circle-up',
  //     subscribers: 427,
  //     statusBgClass: 'bg-primary-gradient'
  //   },
  //   {
  //     title: 'إجمالى المبيعات',
  //     number: 1230.17,
  //     status: 'مقارنة بالعام الماضى',
  //     statusIcon: 'fa-arrow-circle-up',
  //     subscribers: 523,
  //     statusBgClass: 'bg-success-gradient'
  //   },
  //   {
  //     title: 'الطلبات الملغية',
  //     number: -12,
  //     status: 'مقارنة بالامس',
  //     statusIcon: 'fa-arrow-circle-down',
  //     subscribers: 312,
  //     statusBgClass: 'bg-danger-gradient'
  //   },
  //   {
  //     title: 'الطلبات المعلقة',
  //     number: 993.74,
  //     status: 'مقارنة بأخر 10 أيام',
  //     statusIcon: 'fa-arrow-circle-up',
  //     subscribers: 12,
  //     statusBgClass: 'bg-warning-gradient'
  //   },
  //   {
  //     title: 'الطلبات المنتهية',
  //     number: 486,
  //     status: 'مقارنة بالشهر الماضى',
  //     statusIcon: 'fa-arrow-circle-up',
  //     subscribers: 150,
  //     statusBgClass: 'bg-secondary-gradient'
  //   },
  // ];

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

  overviewList: any;
  orders = []
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  activeFilter: number;
  FromDate = new Date();
  ToDate = new Date();
  branchId = 0;
  SalesSummaryStatistics: any;
  showLoader: boolean = false;
  VacationsTotalCount: any;
  LoansTotalCount: any;
  VacationsList: any[] = [];
  LoansList: any[] = [];
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };

  constructor(private modalService: NgbModal,
    private hrService: HrService,
    private paymentService: PaymentService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getEmployeesSummary();
    this.getVacationsRequests();
    this.getLoansRequests();
    // this.GetDailyJournalEntriesSummary();
    // this.GetPurchaseInvoicesSummary();
    // this.GetPaymentReceiptsSummary();
    // this.GetReceiveReceiptsSummary();
  }

  getEmployeesSummary() {
    this.hrService.GetEmployeesSummary().subscribe(data => {
      this.overviewList = data;
      console.log(data);
    });
  }

  getVacationsRequests() {
    this.showLoader = true;
    this.hrService.GetAllEmployeeVacationsData(this.SearchFilterModel).subscribe(data => {
      this.VacationsList = data.results;
      this.VacationsTotalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getLoansRequests() {
    this.showLoader = true;
    this.hrService.GetAllEmployeeLoansData(this.SearchFilterModel).subscribe(data => {
      this.LoansList = data.results;
      this.LoansTotalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }
}
