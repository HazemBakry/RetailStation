import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import SwiperCore, { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { AuthService } from 'src/app/Auth/auth.service';
import { WebsiteService } from 'src/app/components/Main/services/website.service';
import { MerchantItemModel } from '../../models/MerchantItemModel';

// install Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  posRoles: string[] = ['Cashier', 'Supervisor', 'Manager', 'SuperAdmin'];

  loggedInUser: any;
  activeListSidebar: string;
  users: any[] = [];
  imagesData: any[] = [];
  videosData: any[] = [];
  time = new Date();
  clock: string;
  intervalClock;
  Clock: string;

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private authService: AuthService,
    private websiteService: WebsiteService,
    private menuService: MenuService,
    private toaster: ToastrService) {
    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.GeneralAccountsHome, this.selectedTabName);
      }

      this.loggedInUser = this.authService.getCurrentUser();

    });
  }

  ngOnInit(): void {
    this.getSearchQuery();
    this.createClock();
    this.loadData();

  }

  createClock() {
    this.intervalClock = setInterval(() => {
      this.time = new Date();
      this.clock = this.time.getHours() + ':' + (this.time.getMinutes() < 10 ? '0' : '') + this.time.getMinutes()
    }, 1000);
  }

  getSearchQuery() {
    this.route.queryParams.subscribe(params => {
      if (params['searchText']) {
      }
      if (params['itemId']) {
      }
    });
  }

  loadData() {
    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      this.pageResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}
