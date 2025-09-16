import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { SupplierItemModel } from '../../../models/SupplierItemModel';
import { WebsiteService } from '../../../services/website.service';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-website-main-items',
  templateUrl: './website-main-items.component.html',
  styleUrls: ['./website-main-items.component.css']
})
export class WebsiteMainItemsComponent implements OnInit {
  systemURL: string = environment.systemUrl;
  UserModel: any;
  activeOrderFilter: number;
  activeSectionsFilter: number;
  counterValue = 1;
  TotalValue = 0;
  NetValue = 0;
  DeliveryFees = 5;
  countRange = 7;
  count = 1 * this.countRange;

  mostPopular = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];

  showLoader: boolean = false;
  filterList: FilterModel[] = [];
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersData: SupplierItemModel[] = [];
  supplierLogo: string = 'https://s3-eu-west-1.amazonaws.com/elmenusv5-stg/Thumbnail/fa4f0bed-7ae1-4381-a81c-455259a981bf.jpg'
  defaultItemImage = `${this.systemURL}assets/images/13.png`;

  constructor(config: NgbCarouselConfig, private websiteService: WebsiteService,
    private sharedService: SharedService, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, private toaster: ToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe(params => {
      if (params['tabName']) {
      }
    });
  }
  ngOnInit(): void {
    this.getSearchQuery();
    this.loadData();
    this.loadFilters();
  }

  getSearchQuery() {
    let searchText: string = '';
    // this.route.queryParams.subscribe(params => {
    //   searchText = params['q'] || '';
    //   if (params['itemId']) {
    //   }
    // });

    this.route.queryParamMap.subscribe(params => {
      searchText = params.get('q') || '';
      this.pageResponseModel.filterList = [];
      if (searchText) {
        let searchFilter: FilterItem = { categoryName: 'SearchText', itemFlag: searchText }
        this.pageResponseModel.filterList.push(searchFilter);
      }
      this.pageResponseModel.results = [];
      this.suppliersData = [];
      this.loadData();
    });
  }
  loadData() {
    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      this.suppliersData = this.suppliersData.concat([...data.results]);
      this.pageResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  loadFilters() {
    // this.showLoader = true;
    this.websiteService.GetWebsiteItems_Filters(this.pageResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.loadData();
  }
  filterChecked(filterItems: FilterItem[]) {
    this.pageResponseModel.filterList = filterItems;
    // this.pageResponseModel.filterList.push(this.mainFilter);
    this.suppliersData = [];
    this.loadData();
  }
}
