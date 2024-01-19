import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CostCenterTreeModel } from '../../../models/GeneralAccounts/CostCenter';

@Component({
  selector: 'app-cost-center-tree-item',
  templateUrl: './cost-center-tree-item.component.html',
  styleUrls: ['./cost-center-tree-item.component.css']
})
export class CostCenterTreeItemComponent implements OnInit {

  expanded = false;
  @Input() costCenter: CostCenterTreeModel;

  @Output() selectedCostCenter = new EventEmitter<CostCenterTreeModel>();
  constructor() { }

  ngOnInit(): void {
    this.expanded=(this.costCenter.isSelected&&this.costCenter.children.some(x=>x.isSelected));
  }

  toggleNode(costCenter: CostCenterTreeModel) {
    this.expanded = !this.expanded;
  }
  onEvent(e:Event,costCenter: CostCenterTreeModel) {
    event.preventDefault(); 
    event.stopPropagation();
    this.selectCostCenter(costCenter);
  }
  selectCostCenter(costCenter: CostCenterTreeModel) {
    this.selectedCostCenter.emit(costCenter);
  }

}
