import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-erp-selector',
  templateUrl: './erp-selector.component.html',
  styleUrls: ['./erp-selector.component.css']
})
export class ErpSelectorComponent implements OnInit {
  @Input() ItemsList: any[] = [];
  @Input() SelectorName: any;
  @Input() Height = '50px';
  @Input() ValidateMessage: string;
  @Input() isValid = false;
  @Output() ItemObj = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  onItemClick(item: any) {
    this.SelectorName = item.nameAR;
    this.isValid = false;
    this.ItemObj.emit(item);
  }

}
