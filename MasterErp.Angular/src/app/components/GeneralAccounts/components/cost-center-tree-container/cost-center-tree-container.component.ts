import { Component, OnInit } from '@angular/core';
import { CostCenterTreeModel } from '../../models/GeneralAccounts/CostCenter';

@Component({
  selector: 'app-cost-center-tree-container',
  templateUrl: './cost-center-tree-container.component.html',
  styleUrls: ['./cost-center-tree-container.component.css']
})
export class CostCenterTreeContainerComponent implements OnInit {
  selectedCostCenterTreeModel: CostCenterTreeModel = {} as CostCenterTreeModel;
  isUpdate:boolean=false;
  reloadData:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  dataUpdated(event)
  {

    this.isUpdate=false;
    this.selectedCostCenterTreeModel={} as CostCenterTreeModel;
    this.reloadData=!this.reloadData;
  }
  selectedCostCenter(costCenter:CostCenterTreeModel)
  {
    this.selectedCostCenterTreeModel=costCenter;
    this.isUpdate=true;
  }

}
