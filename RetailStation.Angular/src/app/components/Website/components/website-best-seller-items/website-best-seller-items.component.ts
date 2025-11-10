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
  selector: 'app-website-best-seller-items',
  templateUrl: './website-best-seller-items.component.html',
  styleUrls: ['./website-best-seller-items.component.css']
})
export class WebsiteBestSellerItemsComponent implements OnInit {
  isAuthenticated: boolean = false;
  systemURL: string = environment.systemUrl;
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

  constructor(private websiteService: WebsiteService,
    private authService: AuthService,
    private compareService: CompareService) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.compareService.compareList$.subscribe(list => {
      this.checkCompareAdded();
    });
    this.loadData();

  }

  loadData() {
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

  checkCompareAdded() {
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
    if (this.searchFList?.length) {
      this.pageResponseModel.filterList = this.pageResponseModel.filterList.concat(this.searchFList);
    }
    this.loadData();
  }
}

