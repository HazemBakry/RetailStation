import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
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

    this.router.navigate(['/'], {
      relativeTo: this.acRoute,
      queryParams: { q: this.searchText },
      queryParamsHandling: 'merge'
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
