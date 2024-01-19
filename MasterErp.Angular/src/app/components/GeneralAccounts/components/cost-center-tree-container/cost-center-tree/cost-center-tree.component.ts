import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostCenterTreeModel } from '../../../models/GeneralAccounts/CostCenter';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralAccountService } from '../../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cost-center-tree',
  templateUrl: './cost-center-tree.component.html',
  styleUrls: ['./cost-center-tree.component.css']
})
export class CostCenterTreeComponent implements OnInit {
  
  @Input() isParentCostCenter: boolean = false;
  @Input() reloadData: boolean = false;
  @Output() selectedCostCenter = new EventEmitter<any>();

  CostCenterTreeData: any[] = [];
  CostCenterData: any[] = [];
  showLoader: boolean;
  SearchText = '';
  isSearchMode = false;
  parentCostCentersList: any[] = [];
  CostCenterTypes: any[] = [];

  costCenterTreeModel: CostCenterTreeModel =
    {} as CostCenterTreeModel;
  constructor(private sharedService: SharedService,
    private _GeneralAccountService: GeneralAccountService, private toaster: ToastrService) { }


  ngOnInit(): void {
    this.loadData();

  }
  ngOnChanges(changes): void {
    if (changes && changes.reloadData && !changes.reloadData.firstChange) {
      this.loadData();
    }
  }


  selectCostCenter(costCenter: CostCenterTreeModel) {
   

    this.selectedCostCenter.emit(costCenter);
  }

  loadData() {

    this.showLoader = true;
    this._GeneralAccountService.GetCostCenterTreeHierarchicalData(this.SearchText).subscribe(data => {
      this.showLoader = false;
      this.isSearchMode = true;
      this.CostCenterTreeData = data;

    }, (error) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }



  changeSearchType(event) {

  }
}
