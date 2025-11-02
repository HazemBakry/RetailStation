import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { SalesService } from 'src/app/components/Sales/services/sales.service';
import { ItemCategoryModel } from 'src/app/components/Shared/models/ItemCategory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';
import { SearchAutoCompleteModel } from '../../models/SearchAutoCompleteModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-website-search',
  templateUrl: './website-search.component.html',
  styleUrls: ['./website-search.component.css', '../../../../../styles-website.css']
})
export class WebsiteSearchComponent implements OnInit {

  isSearchDropdown: boolean = false;
  @Input() placeholder: string = 'search'
  @Input() searchPage: string = ''
  searchText: string = '';
  searchResults: SearchAutoCompleteModel[] = [];
  catId: number;
  cityId: number;
  systemUrl: string = environment.systemUrl;
  categories: ItemCategoryModel[] = [];
  selectedCategory: ItemCategoryModel;
  selectedCity: GeneralSelectorModel;
  citiesSelectorData: GeneralSelectorModel[] = [];

  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private lookupService: LookupService,
    private sharedService: SharedService,
    private websiteService: WebsiteService) {
  }

  ngOnInit(): void {
    this.acRoute.queryParamMap.subscribe(params => {
      this.searchText = params.get('q') || '';
      this.catId = params.get('catId') ? Number(params.get('catId')) : null;
      this.cityId = params.get('cityId') ? Number(params.get('cityId')) : null;
    });
    this.getItemCategories();
    this.GetCitiesSelector();

  }

  getItemCategories() {
    this.websiteService.GetWebsiteHomeCategories().subscribe((data: PagedResponseDTO<ItemCategoryModel[]>) => {
      this.categories = data.results;
      if (this.catId) {
        this.selectedCategory = this.categories.find(c => c.itemCategoryId == this.catId);
      }
    }, err => {

    }, () => {

    });
  }

  onCategorySelected(cat) {
    this.selectedCategory = cat;
  }

  search() {
    debugger
    // if (!this.searchText) return;
    let queryParams: any = {};
    if (this.searchText) {
      queryParams.q = this.searchText;
      if (this.selectedCategory)
        queryParams.catId = this.selectedCategory.itemCategoryId;
      if (this.selectedCity)
        queryParams.cityId = this.selectedCity.value;
    }

    let path = '/';
    // if (this.authService.isAuthenticated()) {
    //   path = '/purchases'
    // }
    this.router.navigate([path], {
      relativeTo: this.acRoute,
      //queryParams: { q: this.searchText },
      queryParams: queryParams,
      //queryParamsHandling: 'merge'
    });
    this.isSearchDropdown = false;
  }

  onClickedOutside() {
  }

  goToPage(id: any) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { SubscriberId: id },
        queryParamsHandling: 'merge'
      });
    }
  }

  getSearchAutoComplete(event: any) {
    this.searchResults = [];
    if (!this.searchText || this.searchText?.length < 2)
      return;

    this.websiteService.SearchAutoComplete(this.searchText).subscribe((data: SearchAutoCompleteModel[]) => {
      this.searchResults = data;
    }, err => {

    }, () => {

    });
  }
  navigateToSearchPage(item: SearchAutoCompleteModel) {
    this.searchText = item.nameEN;
    this.search();
  }
  onCitySelected(city) {
    this.selectedCity = city;
  }
  GetCitiesSelector() {
    this.sharedService.GetCitiesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.citiesSelectorData = data;
      if (this.cityId)
        this.selectedCity = this.citiesSelectorData.find(c => c.value == this.cityId);

    });
  }
}
