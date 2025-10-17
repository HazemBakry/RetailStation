import { Component, OnInit } from '@angular/core';
import { ItemCategoryModel } from 'src/app/components/Admin/models/Operation/itemCategory';
import { OperationService } from 'src/app/components/Admin/services/operation.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-website-main-categories',
  templateUrl: './website-main-categories.component.html',
  styleUrls: ['./website-main-categories.component.css']
})
export class WebsiteMainCategoriesComponent implements OnInit {
  showLoader: boolean = false;
  responseModel: PagedResponseModel<ItemCategoryModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''

  };
  constructor(private operationService: OperationService) { }

  ngOnInit(): void {
    this.getItemCategories();
  }

  getItemCategories() {
    this.showLoader = true;
    this.operationService.GetItemCategories().subscribe((data: PagedResponseModel<ItemCategoryModel[]>) => {
      this.responseModel.results = data.results;
      this.responseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }



}
