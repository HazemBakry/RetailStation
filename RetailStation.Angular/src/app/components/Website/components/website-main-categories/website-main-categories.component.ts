import { Component, OnInit } from '@angular/core';
import { ItemCategoryModel } from 'src/app/components/Shared/models/ItemCategory';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { WebsiteService } from '../../services/website.service';

@Component({
  selector: 'app-website-main-categories',
  templateUrl: './website-main-categories.component.html',
  styleUrls: ['./website-main-categories.component.css'],
})
export class WebsiteMainCategoriesComponent implements OnInit {
  showLoader: boolean = false;
  responseModel: PagedResponseModel<ItemCategoryModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: '',
  };
  constructor(
    private webService: WebsiteService
  ) {}

  ngOnInit(): void {
    this.getWebsiteHomeCategories();
  }

  getWebsiteHomeCategories() {
    this.showLoader = true;
    this.webService.GetWebsiteHomeCategories().subscribe(
      (data: PagedResponseModel<ItemCategoryModel[]>) => {
        this.responseModel.results = data.results;
        this.responseModel.totalCount = data.totalCount;
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

  activeCat = null;
  onActiveItem(index: number) {
    this.activeCat = this.responseModel.results[index].itemCategoryId;
  }
}
