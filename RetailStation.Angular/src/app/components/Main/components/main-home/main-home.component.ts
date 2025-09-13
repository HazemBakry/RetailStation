import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { WebsiteService } from '../../services/website.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../../models/SupplierItemModel';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})
export class MainHomeComponent implements OnInit {
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private websiteService: WebsiteService,
    private menuService: MenuService,
    private toaster: ToastrService) {
    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.GeneralAccountsHome, this.selectedTabName);
      }
    });
  }

  ngOnInit(): void {
    this.getSearchQuery();
    this.loadData();

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
