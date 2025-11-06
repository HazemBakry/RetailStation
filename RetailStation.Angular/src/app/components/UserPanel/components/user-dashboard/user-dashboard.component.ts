import { Component, HostListener, OnInit } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  isCollapseContent = false;
  UserModel: any;
  Order: any;
  showLoader: boolean;
  filterList: FilterModel[] = [];
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;
  companyStatistics: any[] = [];
  totalPackages: number = 0;
  bookingPercentage: number = 0;
  pagedResponseModel: PagedResponseDTO<any[]> = {
    results: [],
    filterList: [],
    pageSize: 15,
    currentPage: 1,
    searchText: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 20,
    filterItems: [],
  };

  statsInfo = [
    {
      icon: 'fas fa-comments',
      number: 26,
      text: 'New Comments',
      status: 'blue',
    },
    { icon: 'fas fa-server', number: 12, text: 'New Task', status: 'green' },
    {
      icon: 'fas fa-shopping-cart',
      number: 124,
      text: 'New Orders',
      status: 'orange',
    },
    {
      icon: 'fas fa-clipboard-list',
      number: 13,
      text: 'Support Ticket',
      status: 'red',
    },
  ];

  isToggling = false;
  isCollapsing = true;

  

  constructor(
    private authService: AuthService,
    public router: Router) { }

  ngOnInit(): void {
    this.UserModel = this.authService.getCurrentUser();
    //this.getBookingsData();
    //this.getBookingFilters();
    //this.getCompanyPackagesStatistics();

  }

  onToggleContent() {
    this.isToggling = !this.isToggling;
  }

  columnChartType = 'ColumnChart';
  columnChartData = [
    ['Purchase Volume', 600, 0, 0, 0, 0, 0],
    ['Site Visits', 0, 1170, 0, 0, 0, 0],
    ['Orders Processed', 0, 0, 800, 0, 0, 0],
    ['Total Sales', 0, 0, 0, 1300, 0, 0],
    ['Calls Handled', 0, 0, 0, 0, 400, 0],
    ['Other', 0, 0, 0, 0, 0, 900],
  ];
  columnChartNames = [
    'Year',
    'Purchase Volume',
    'Site Visits',
    'Orders Processed',
    'Total Sales',
    'Calls Handled',
    'Other',
  ];
  columnChartOptions = {
    colors: ['#9334E9', '#96E2D6', '#D97708', '#3F8CFF', '#AEC7ED', '#0D9488'],
    backgroundColor: 'transparent',
    chartArea: {
      width: '70%',
      backgroundColor: 'transparent',
    },
    hAxis: {
      title: 'X Axis Title',
    },
    vAxis: {
      title: 'Y Axis Title',
      format: 'short',
    },
    legend: {
      // position: 'bottom',
      alignment: 'center',
    },
    isStacked: true,
  };
  columnChartWidth = (window.innerWidth * 0.95) / 1.6;
  columnChartHeight = window.innerHeight * 0.4;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columnChartWidth = (window.innerWidth * 0.95) / 1.6;
    this.columnChartHeight = window.innerHeight * 0.4;
  }


  // getBookingsData() {
  //   this.showLoader = true;
  //   this.opService.GetBookingsData(this.pagedResponseModel).subscribe(data => {
  //     this.pagedResponseModel.results = data?.results;
  //     this.pagedResponseModel.totalCount = data?.totalCount;
  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });
  // }

  // getBookingFilters() {
  //   this.opService.GetHotelsFilters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
  //     this.filterList = data;
  //   }, (err) => {
  //     // this.showLoader = false;
  //   }, () => {
  //     // this.showLoader = false;
  //   });
  // }

  // getCompanyPackagesStatistics() {
  //   this.totalPackages = 0;
  //   var totalBookings = 0;
  //   this.bookingPercentage = 0;

  //   this.systemopService.GetCompanyPackagesStatistics().subscribe(data => {
  //     this.companyStatistics = data;
  //     this.totalPackages = 0;
  //     this.companyStatistics.forEach(item => {
  //       this.totalPackages += item.packagesCount;
  //     });

  //     this.companyStatistics.forEach(item => {
  //       totalBookings += item.bookingsCount;
  //       // totalBookings += item.bookingsCount!=null?1:0;

  //     });
  //     if(totalBookings&&this.totalPackages)
  //       this.bookingPercentage = (totalBookings / this.totalPackages) * 100;
  //   }, err => { }, () => {
  //   });
  // }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    //this.getBookingsData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    //this.getBookingsData();
  }

  goToPackageTab(companyId: number) {
    if(!companyId)return;
    const filterList = [];
    filterList.push({
      categoryDisplayName: 'Company',
      categoryId: 55,
      categoryName: 'CompanyId',
      isChecked: true,
      itemFlag: companyId?.toString(),
      itemKey: companyId?.toString(),
      itemValue: '0',
    });
    this.router.navigate(['/operation/packages'], {
      queryParamsHandling: 'merge',
      state: { filterList }
    });

  }
  goBookingTab(companyId: number) {
    if(!companyId)return;
    const filterList = [];
    filterList.push({
      categoryDisplayName: 'Company',
      categoryId: 55,
      categoryName: 'CompanyId',
      isChecked: true,
      itemFlag: companyId?.toString(),
      itemKey: companyId?.toString(),
      itemValue: '0',
    });
    this.router.navigate(['/operation/bookings'], {
      queryParamsHandling: 'merge',
      state: { filterList }
    });

  }
}




