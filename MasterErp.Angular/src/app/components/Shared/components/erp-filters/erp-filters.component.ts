import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterItem, FilterModel } from '../../models/FilterModel';

@Component({
  selector: 'app-erp-filters',
  templateUrl: './erp-filters.component.html',
  styleUrls: ['./erp-filters.component.css']
})
export class ErpFiltersComponent implements OnInit {
  @Input() FilterList: FilterModel[];
  @Input() showSearchText: boolean = false;
  @Input() searchPlaceholder: string = '';
  @Output() filterChanged = new EventEmitter<FilterItem[]>();
  SelectedFilter: FilterItem[] = [];
  SearchText: string = '';

  filterSearch: string = '';

  constructor() { }

  ngOnInit(): void {

  }

  filterChecked() {
    this.SelectedFilter = [];
    this.FilterList.map(item => {
      let checked = item.filterItems.filter(a => a.isChecked && a.isChecked == true);
      if (checked.length > 0) {
        checked.map(obj => {
          this.SelectedFilter.push(obj);
        });
      }
    });
    if (this.SearchText) {
      const textFilter: FilterItem = {
        categoryDisplayName: 'بحث بالنص',
        categoryName: 'SearchText',
        itemKey: this.SearchText,
        itemFlag: this.SearchText,
        itemValue: this.SearchText,
        isChecked: true
      }
      this.SelectedFilter.push(textFilter);
    }
    this.filterChanged.emit(this.SelectedFilter);
  }

  RemoveSelectedFilter(filter: any, index: number) {
    this.SelectedFilter.splice(index, 1);
    this.FilterList.map(item => {
      let checked = item.filterItems.find(a => a.categoryName == filter.categoryName);
      if (checked) {
        checked.isChecked = false;
      }
    });
    if (filter.categoryName == 'SearchText')
      this.SearchText = '';

    this.filterChanged.emit(this.SelectedFilter);
  }

  RemoveAllFilters() {
    this.SelectedFilter = [];
    this.FilterList.map(item => {
      item.filterItems.map(a => a.isChecked = false);
    });
    this.SearchText = '';
    this.filterChanged.emit(this.SelectedFilter);
  }
}
