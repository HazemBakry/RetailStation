import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ErpSelectorWithSearchComponent } from 'src/app/components/Shared/components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../../services/general-account.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { CostCenterTreeModel } from '../../../models/GeneralAccounts/CostCenter';

@Component({
  selector: 'app-add-edit-cost-center-tree',
  templateUrl: './add-edit-cost-center-tree.component.html',
  styleUrls: ['./add-edit-cost-center-tree.component.css']
})
export class AddEditCostCenterTreeComponent implements OnInit {

  @Input() isUpdate: boolean = false;
  @Input() costCenterTreeModel: CostCenterTreeModel = {} as CostCenterTreeModel;

  @Output() dataUpdated = new EventEmitter<boolean>();

  @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;

  showLoader: boolean;
  parentCostCenterList: CostCenterTreeModel[] = [];
  costCenterTypes: any[] = [];
  currencyType: any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]

  constructor(private sharedService: SharedService,
    private _GeneralAccountService: GeneralAccountService, private toaster: ToastrService) { }


  ngOnInit(): void {
    
    this.loadParentCostCenterData();
   
  }
  ngOnChanges(changes): void {
    if (changes&&!changes.costCenterTreeModel.firstChange) {
      if (this.costCenterTreeModel&&this.costCenterTreeModel!=null) {
        this.Selector.SelectorName=this.parentCostCenterList.find(x=>x.costCenterId==this.costCenterTreeModel.parentId)?.nameAR;
      }
    }
  }



  loadParentCostCenterData() {
    this.sharedService.GetCostCenterTreeData(true).subscribe(data => {
      this.parentCostCenterList = data;

    })
  }

  CreateNewCostCenter() {
    if (!this.validateFields()) {
      return;
    }
    this._GeneralAccountService
      .CreateNewCostCenter(this.costCenterTreeModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        // this.modalService.dismissAll();
        this.dataUpdated.emit(true);
      });
  }
  UpdateCostCenterTree(){
    if (!this.validateFields()||!this.costCenterTreeModel.costCenterId) {
      return;
    }
    this._GeneralAccountService
      .UpdateCostCenterTree(this.costCenterTreeModel.costCenterId,this.costCenterTreeModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        // this.modalService.dismissAll();
        this.dataUpdated.emit(true);
      });
  }

  validateFields(): boolean {
    let model: CostCenterTreeModel = this.costCenterTreeModel;

    if (
      !model.costCenterNumber ||
      !model.nameEN 

    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.isUpdate=false;
    this.costCenterTreeModel = {} as CostCenterTreeModel;
    this.Selector.SelectorName='نوع مركز التكلفة';

  }

  
  GetSelectedParentCostCenter(costCenter: CostCenterTreeModel) {
    this.costCenterTreeModel.parentId = costCenter.costCenterId;
    this.costCenterTreeModel.costLevel = costCenter.costLevel + 1;

  }
}
