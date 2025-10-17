import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';

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

  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.acRoute
  }

  ngOnInit(): void {
    this.acRoute.queryParamMap.subscribe(params => {
      this.searchText = params.get('q') || '';
    });
  }
  search() {
    // if (!this.searchText) return;
    let queryParams: any = {};
    if (this.searchText)
      queryParams.q = this.searchText;

    let path = '/';
    if (this.authService.isAuthenticated()) {
      path = '/purchases'
    }
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
}
