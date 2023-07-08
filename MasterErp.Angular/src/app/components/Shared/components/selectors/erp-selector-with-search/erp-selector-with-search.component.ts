import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-erp-selector-with-search',
  templateUrl: './erp-selector-with-search.component.html',
  styleUrls: ['./erp-selector-with-search.component.css']
})
export class ErpSelectorWithSearchComponent implements OnInit {
  @Input() ItemsList: any[] = [];
  @Input() SelectorName: any;
  @Input() Height = '50px';
  @Input() ValidateMessage: string;
  @Input() SearchKey = 'nameEN';
  @Input() isValid = false;
  @Output() ItemObj = new EventEmitter<any>();
  SearchText: any;

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(item: any) {
    this.SelectorName = item.nameEN;
    this.isValid = false;
    this.ItemObj.emit(item);
  }

}
