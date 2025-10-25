import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FilterItem, FilterModel } from '../../models/FilterModel';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filters',
  templateUrl: './app-filters.component.html',
  styleUrls: ['./app-filters.component.css'],
})
export class AppFiltersComponent implements OnInit, OnChanges {
  @Input() FilterList: FilterModel[] = [];
  @Input() showSearchText: boolean = false;
  @Input() searchPlaceholder: string = '';
  @Output() filterChanged = new EventEmitter<FilterItem[]>();
  SelectedFilter: FilterItem[] = [];
  SearchText: string = '';

  filterSearch: string = '';

  checkOverflowText(el: HTMLElement, e: Event) {
    if (!(el.scrollWidth > el.clientWidth)) e.stopImmediatePropagation();
  }

  constructor() {}
  ngOnChanges(changes: any): void {
    if (changes.FilterList && this.FilterList && this.FilterList.length > 0) {
      this.SelectedFilter = [];
      this.FilterList.map((item) => {
        let checked = item.filterItems.filter(
          (a) => a.isChecked && a.isChecked == true
        );
        if (checked.length > 0) {
          checked.map((obj) => {
            this.SelectedFilter.push(obj);
          });
        }
      });
    }
  }

  ngOnInit(): void {}

  filterChecked() {
    this.SelectedFilter = [];
    this.FilterList.map((item) => {
      let checked = item.filterItems.filter(
        (a) => a.isChecked && a.isChecked == true
      );
      if (checked.length > 0) {
        checked.map((obj) => {
          this.SelectedFilter.push(obj);
        });
      }
    });
    if (this.SearchText) {
      const textFilter: FilterItem = {
        categoryDisplayName: 'Search Text',
        categoryName: 'SearchText',
        itemKey: this.SearchText,
        itemFlag: this.SearchText,
        itemValue: this.SearchText,
        isChecked: true,
      };
      this.SelectedFilter.push(textFilter);
    }
    this.filterChanged.emit(this.SelectedFilter);
  }

  RemoveSelectedFilter(filter: any, index: number) {
    this.SelectedFilter.splice(index, 1);
    this.FilterList.map((item) => {
      let checked = item.filterItems.find(
        (a) => a.categoryName == filter.categoryName
      );
      if (checked) {
        checked.isChecked = false;
      }
    });
    if (filter.categoryName == 'SearchText') this.SearchText = '';

    this.filterChanged.emit(this.SelectedFilter);
  }

  RemoveAllFilters() {
    this.SelectedFilter = [];
    this.FilterList.map((item) => {
      item.filterItems.map((a) => (a.isChecked = false));
    });
    this.SearchText = '';
    this.filterChanged.emit(this.SelectedFilter);
  }
}
