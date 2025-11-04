import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-website-main-items',
  templateUrl: './website-main-items.component.html',
  styleUrls: ['./website-main-items.component.css']
})
export class WebsiteMainItemsComponent implements OnInit, OnChanges {
  @Input() selectedCategoryId: number;
  @Input() selectedCategoryName: number;
  isAuthenticated: boolean = false;
  searchText: string = '';
  itemCategoryId: string = '';
  cityId: string = '';
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
  searchFList: FilterItem[] = [];
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  bestSellerData: MerchantItemModel[] = [];
  merchantsData: MerchantItemModel[] = [];
  supplierLogo: string = 'https://s3-eu-west-1.amazonaws.com/elmenusv5-stg/Thumbnail/fa4f0bed-7ae1-4381-a81c-455259a981bf.jpg'
  defaultItemImage = `${this.systemURL}assets/images/13.png`;

  constructor(config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe, private compareService: CompareService) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe(params => {
      if (params['tabName']) {
      }
    });
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.compareService.compareList$.subscribe(list => {
      this.checkCompareAdded();
    });
    this.getSearchQuery();
    this.loadBestSellersData();
    this.loadData();
    this.loadFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId'] && !changes['selectedCategoryId'].firstChange) {
      this.itemCategoryId = this.selectedCategoryId ? this.selectedCategoryId.toString() : '';
      this.applySearch();
    }
  }
  getSearchQuery() {
    let searchText: string = '';
    let itemCategoryId: string = '';
    // this.route.queryParams.subscribe(params => {
    //   searchText = params['q'] || '';
    //   if (params['itemId']) {
    //   }
    // });

    this.route.queryParamMap.subscribe(params => {
      this.searchText = params.get('q') || '';
      this.itemCategoryId = params.get('catId') || '';
      this.cityId = params.get('cityId') || '';
      this.applySearch();
      // this.pageResponseModel.filterList = [];
      // if (searchText) {
      //   let searchFilter: FilterItem = { categoryName: 'SearchText', itemFlag: searchText }
      //   this.pageResponseModel.filterList.push(searchFilter);
      // }
      // if (itemCategoryId) {
      //   let searchFilter: FilterItem = { categoryName: 'ItemCategoryId', itemFlag: itemCategoryId }
      //   this.pageResponseModel.filterList.push(searchFilter);
      // }
      // this.pageResponseModel.results = [];
      // this.merchantsData = [];
      // this.loadData();
    });
  }

  applySearch() {
    this.pageResponseModel.filterList = [];
    this.searchFList = [];
    if (this.searchText) {
      let searchFilter: FilterItem = { categoryName: 'SearchText', itemFlag: this.searchText }
      this.pageResponseModel.filterList.push(searchFilter);
    }
    if (this.itemCategoryId) {
      let searchFilter: FilterItem = { categoryName: 'CategoryId', itemFlag: this.itemCategoryId }
      this.pageResponseModel.filterList.push(searchFilter);
    }
    if (this.cityId) {
      let searchFilter: FilterItem = { categoryName: 'CityId', itemFlag: this.cityId }
      this.pageResponseModel.filterList.push(searchFilter);
    }
    this.searchFList = [...this.pageResponseModel.filterList];
    // this.pageResponseModel.results = [];
    //this.merchantsData = [];
    this.loadData();
    this.loadFilters();
  }
  loadBestSellersData() {
    let pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
      results: [],
      filterList: [],
      pageSize: 20,
      currentPage: 1,
      searchText: ''
    };
    // this.showLoader = true;
    this.websiteService.GetWebsiteBestSellerItems_Data(pageResponseModel).subscribe(data => {
      this.bestSellerData = data.results;
      this.checkCompareAdded();
      // this.showLoader = false;
    }, err => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }
  loadData() {
    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      // this.merchantsData = this.merchantsData.concat([...data.results]);
      this.merchantsData = data.results;
      this.pageResponseModel.totalCount = data.totalCount;
      this.checkCompareAdded();
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
  checkCompareAdded() {
    this.merchantsData.forEach(item => {
      item.isCompareAdded = this.compareService.isItemInList(item.merchantItemId);
      // item.isCompareAdded  = list.some(i => i.merchantItemId === item.merchantItemId);
    });
    this.bestSellerData.forEach(item => {
      item.isCompareAdded = this.compareService.isItemInList(item.merchantItemId);
    });

  }
  toggleCompare(item: MerchantItemModel): void {
    if (item.isCompareAdded) {
      this.compareService.removeItem(item.merchantItemId, item.itemId);
    } else {
      this.compareService.addItem(item.merchantItemId, item.itemId);
    }
  }
  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.loadData();
  }
  filterChecked(filterItems: FilterItem[]) {
    this.pageResponseModel.filterList = filterItems;
    if(this.searchFList?.length)
    {
      this.pageResponseModel.filterList = this.pageResponseModel.filterList.concat(this.searchFList);
    }
    // this.pageResponseModel.filterList.push(this.mainFilter);
    //this.merchantsData = [];
    this.loadData();
  }
}
