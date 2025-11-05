import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-website-favorites',
  templateUrl: './website-favorites.component.html',
  styleUrls: ['./website-favorites.component.css']
})
export class WebsiteFavoritesComponent  implements OnInit {
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
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  favoritesData: MerchantItemModel[] = [];
  defaultItemImage = `${this.systemURL}assets/images/13.png`;

  constructor(
    private websiteService: WebsiteService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe, private compareService: CompareService) {
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
    this.loadData();
    this.loadFilters();
  }


  loadData() {
    this.showLoader = true;
    this.websiteService.GetWebsiteFavoriteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      // this.favoritesData = this.favoritesData.concat([...data.results]);
      this.favoritesData = data.results;
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
    // // this.showLoader = true;
    // this.websiteService.GetWebsiteItems_Filters(this.pageResponseModel).subscribe((data: FilterModel[]) => {
    //   this.filterList = data;
    // }, (err) => {
    //   // this.showLoader = false;
    // }, () => {
    //   // this.showLoader = false;
    // });
  }
  checkCompareAdded() {
    this.favoritesData.forEach(item => {
      item.isCompareAdded = this.compareService.isItemInList(item.merchantItemId);
      // item.isCompareAdded  = list.some(i => i.merchantItemId === item.merchantItemId);
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
    this.loadData();
  }
}
