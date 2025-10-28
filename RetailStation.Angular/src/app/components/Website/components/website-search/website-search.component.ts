import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { SalesService } from 'src/app/components/Sales/services/sales.service';
import { ItemCategoryModel } from 'src/app/components/Shared/models/ItemCategory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';

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
  systemUrl: string = environment.systemUrl;
  categories: ItemCategoryModel[] = [];
  selectedCategory: ItemCategoryModel

  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private websiteService: WebsiteService) {
  }

  ngOnInit(): void {
    this.acRoute.queryParamMap.subscribe(params => {
      this.searchText = params.get('q') || '';
    });
    this.getItemCategories();
  }

  getItemCategories() {
    this.websiteService.GetWebsiteHomeCategories().subscribe((data: PagedResponseDTO<ItemCategoryModel[]>) => {
      this.categories = data.results;
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
    // let queryParams: any = {};
    // if (this.searchText)
    //   queryParams.q = this.searchText;

    // let path = '/';
    // if (this.authService.isAuthenticated()) {
    //   path = '/purchases'
    // }
    // this.router.navigate([path], {
    //   relativeTo: this.acRoute,
    //   //queryParams: { q: this.searchText },
    //   queryParams: queryParams,
    //   //queryParamsHandling: 'merge'
    // });
    // this.isSearchDropdown = false;
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
}
