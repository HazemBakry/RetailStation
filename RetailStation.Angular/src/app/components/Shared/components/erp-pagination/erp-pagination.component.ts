import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-erp-pagination',
  templateUrl: './erp-pagination.component.html',
  styleUrls: ['./erp-pagination.component.css']
})
export class ErpPaginationComponent implements OnInit ,OnChanges{
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() totalPages: number;
  @Input() newPagination: boolean = true;
  pages: number[] = [];

  @Output() pageChanged = new EventEmitter<any>();
  maxSize = 3;
  showingStr = '';
  constructor() { }

  ngOnInit(): void {
    this.resetShowingStr();
  }

  ngOnChanges(changes: any){
    this.resetShowingStr();
    if(!changes.totalCount?.firstChange)//&&!changes.totalCount?.previousValue)
    {
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this. generatePages();

    }
  }

  resetShowingStr() {
    let showingStr = '';
    // last page
    const lPage = this.currentPage * this.pageSize;
    if (lPage >= this.totalCount) {
      const fNum =  (this.pageSize * (this.currentPage - 1)) + 1;
      const lNum =  (this.totalCount - fNum);
      showingStr = (fNum) + '-' + (lNum + fNum);

    } else {
      // last page
      if (this.totalPages === this.currentPage) {
        if (this.currentPage === 1 || this.currentPage === 0) {
          showingStr = this.currentPage + '-' + this.totalCount;
        }
        const fNum = (this.pageSize * (this.currentPage - 1));
        const lNum = (this.totalCount - fNum) ;
        showingStr = (fNum + 1) + '-' + (lNum + fNum);
      } else {
        if (this.currentPage === 1 || this.currentPage === 0) {
          if (this.totalCount !== 0 && (this.pageSize > this.totalCount)) {
            showingStr = this.currentPage + '-' + this.totalCount;
          } else {
            showingStr = '1-' + this.pageSize;
          }
        } else {
          showingStr = (this.pageSize * (this.currentPage - 1)) + 1 + '-' + ( this.currentPage * this.pageSize );
        }
      }
    }
    this.showingStr = showingStr;
  }

  pageChangeEvent(event: any): void {
    this.currentPage = event.page;
    this.pageChanged.emit(event);
    this.resetShowingStr();
  }
  generatePages() {
    const startPage = Math.max(this.currentPage - 1, 1); // Show previous page if possible
    const endPage = Math.min(startPage + 2, this.totalPages); // Show current page and one next page
    this.pages = Array(endPage - startPage + 1)
      .fill(0)
      .map((_, i) => startPage + i);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      // this.pageChanged.emit(this.currentPage);
      this.pageChanged.emit({ page: this.currentPage });
      this.generatePages(); // Regenerate the pages after changing the current page
    }
  }
}


@Component({
  selector: 'app-pagination',
  templateUrl: './erp-pagination.component.html',
  styleUrls: ['./erp-pagination.component.css']
})
export class PaginationComponent implements OnInit ,OnChanges{
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() totalPages: number;
  @Input() newPagination: boolean = true;
  pages: number[] = [];

  @Output() pageChanged = new EventEmitter<any>();
  maxSize = 3;
  showingStr = '';
  constructor() { }

  ngOnInit(): void {
    this.resetShowingStr();
  }

  ngOnChanges(changes: any){
    this.resetShowingStr();
    if(!changes.totalCount?.firstChange)//&&!changes.totalCount?.previousValue)
    {
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this. generatePages();

    }
  }

  resetShowingStr() {
    let showingStr = '';
    // last page
    const lPage = this.currentPage * this.pageSize;
    if (lPage >= this.totalCount) {
      const fNum =  (this.pageSize * (this.currentPage - 1)) + 1;
      const lNum =  (this.totalCount - fNum);
      showingStr = (fNum) + '-' + (lNum + fNum);

    } else {
      // last page
      if (this.totalPages === this.currentPage) {
        if (this.currentPage === 1 || this.currentPage === 0) {
          showingStr = this.currentPage + '-' + this.totalCount;
        }
        const fNum = (this.pageSize * (this.currentPage - 1));
        const lNum = (this.totalCount - fNum) ;
        showingStr = (fNum + 1) + '-' + (lNum + fNum);
      } else {
        if (this.currentPage === 1 || this.currentPage === 0) {
          if (this.totalCount !== 0 && (this.pageSize > this.totalCount)) {
            showingStr = this.currentPage + '-' + this.totalCount;
          } else {
            showingStr = '1-' + this.pageSize;
          }
        } else {
          showingStr = (this.pageSize * (this.currentPage - 1)) + 1 + '-' + ( this.currentPage * this.pageSize );
        }
      }
    }
    this.showingStr = showingStr;
  }

  pageChangeEvent(event: any): void {
    this.currentPage = event.page;
    this.pageChanged.emit(event);
    this.resetShowingStr();
  }
  generatePages() {
    const startPage = Math.max(this.currentPage - 1, 1); // Show previous page if possible
    const endPage = Math.min(startPage + 2, this.totalPages); // Show current page and one next page
    this.pages = Array(endPage - startPage + 1)
      .fill(0)
      .map((_, i) => startPage + i);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      // this.pageChanged.emit(this.currentPage);
      this.pageChanged.emit({ page: this.currentPage });
      this.generatePages(); // Regenerate the pages after changing the current page
    }
  }
}