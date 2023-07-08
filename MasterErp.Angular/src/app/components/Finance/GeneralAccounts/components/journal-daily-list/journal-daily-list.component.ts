import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-journal-daily-list',
  templateUrl: './journal-daily-list.component.html',
  styleUrls: ['./journal-daily-list.component.css']
})
export class JournalDailyListComponent implements OnInit {
  filterList: FilterModel[] = [];
  showLoader: boolean;
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;
  constructor() { }

  ngOnInit(): void {
  }

  pageChanged(obj) {

  }

  filterChecked(filterList: FilterItem[]) {

  }

}
