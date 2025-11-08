import { Component, OnInit } from '@angular/core';
import {
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';

import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { ItemCategoryModel } from 'src/app/components/Shared/models/ItemCategory';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-website-categories',
  templateUrl: './website-categories.component.html',
  styleUrls: ['./website-categories.component.css']
})
export class WebsiteCategoriesComponent implements OnInit {
  systemURL: string = environment.systemUrl;
  showLoader: boolean = false;
  CategoriesList: ItemCategoryModel[] = [];
  filterList: FilterModel[] = [];
  searchText: string = '';
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 12,
    currentPage: 1,
    searchText: '',
  };
  //ItemsList: MerchantItemModel[] = [];

  constructor(
    config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private route: ActivatedRoute,
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    // this.getSearchQuery();
    this.getWebsiteHomeCategories();
  }
  getSearchQuery() {
    let itemCategoryId: string = '';
    this.route.queryParamMap.subscribe(params => {
      itemCategoryId = params.get('catId') || '';
      this.searchText = params.get('q') || '';
      if (itemCategoryId) {
        this.activeCategoryId = Number(itemCategoryId);
        this.activeCategoryName = this.CategoriesList.find(c => c.itemCategoryId == this.activeCategoryId)?.nameAR;
      }
    });
  }


  getWebsiteHomeCategories() {
    this.showLoader = true;
    this.websiteService.GetWebsiteHomeCategories().subscribe(
      (data: PagedResponseModel<ItemCategoryModel[]>) => {
        this.CategoriesList = data.results;
        //this.responseModel.totalCount = data.totalCount;
        this.showLoader = false;
      },
      (err) => {
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
      }
    );
  }

  activeCategoryId = null;
  activeCategoryName = null;
  onActiveItem(index: number) {
    this.activeCategoryId = this.CategoriesList[index].itemCategoryId;
    this.activeCategoryName = this.CategoriesList[index].nameAR;
    // this.getItemsByCategoryId();
  }


}
