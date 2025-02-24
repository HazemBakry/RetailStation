import { Component, OnInit } from '@angular/core';
import { CostCenterTreeModel } from '../../models/GeneralAccounts/CostCenter';
import { GeneralAccountService } from '../../services/general-account.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportStyle } from 'src/app/components/Shared/Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-cost-center-tree-container',
  templateUrl: './cost-center-tree-container.component.html',
  styleUrls: ['./cost-center-tree-container.component.css']
})
export class CostCenterTreeContainerComponent implements OnInit {
  selectedCostCenterTreeModel: CostCenterTreeModel = {} as CostCenterTreeModel;
  isUpdate:boolean=false;
  reloadData:boolean=false;
  showExportLoader: boolean = false;
  TitleList = ['الحسابات العامة', 'مراكز التكلفة'];

  constructor(private _GeneralAccountService:GeneralAccountService,private _SharedService:SharedService,private toaster:ToastrService) { }


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
  exportData() {
    this.showExportLoader = true;
    this._GeneralAccountService.ExportCostCenterTreeList("").subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this._SharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }


      this.showExportLoader = false;
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });


  }
}
