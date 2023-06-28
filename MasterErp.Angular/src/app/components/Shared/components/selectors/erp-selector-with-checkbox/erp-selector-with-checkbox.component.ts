import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-erp-selector-with-checkbox',
  templateUrl: './erp-selector-with-checkbox.component.html',
  styleUrls: ['./erp-selector-with-checkbox.component.css']
})
export class ErpSelectorWithCheckboxComponent implements OnInit {
  @Input() ItemsList: any[] = [];
  @Input() SelectorName: any;
  @Input() Height = '50px';
  @Input() ValidateMessage: string;
  @Input() isValid = false;
  @Output() ItemsChecked = new EventEmitter<any>();
  @Output() IsSelectAll = new EventEmitter<any>();
  SearchText: any;

  constructor() { }

  ngOnInit(): void {
  }

  SelectAllItems(isSelected: boolean) {
    this.ItemsList.forEach(i => i.isChecked = isSelected);
    if (this.isValid)
      this.isValid = isSelected ? false : true;
    this.IsSelectAll.emit(isSelected);
  }

  onItemChange() {
    let itemsChecked = this.ItemsList.filter(i => i.isChecked);
    this.isValid = itemsChecked.length > 0 ? false : true;
    this.ItemsChecked.emit(itemsChecked);
  }

}
