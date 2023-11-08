import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

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
  @Input() innerTextKey:string = 'nameAR';
  @Input() isValid = false;
  @Output() ItemObj = new EventEmitter<any>();
  SearchText: any;

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(item: any) {
    this.SelectorName = item[this.innerTextKey];
    this.isValid = false;
    this.ItemObj.emit(item);
  }

  ResetSelectorName(selectorName: string) {
    this.SelectorName = selectorName;
  }

}
