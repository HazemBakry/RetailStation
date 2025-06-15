
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { GeneralSelectorModel } from '../general-selector/general-selector.component';
import { MaterialRequestModel } from 'src/app/components/Inventory/models/MaterialRequestModel ';

@Component({
  selector: 'app-material-requests-side-panel',
  templateUrl: './material-requests-side-panel.component.html',
  styleUrls: ['./material-requests-side-panel.component.css'],
  encapsulation: ViewEncapsulation.None,

})


export class MaterialRequestsSidePanelComponent implements OnInit {
  @Input() selectedBranchId: any;

  @Output() selectedMaterialRequest=new EventEmitter<MaterialRequestModel[]>()
  OrdersList: any[] = [];
  showLoader: boolean;

  selectAll:boolean=false;

  orderNumber:string = '';
  orderDate:string ;
  pagedResponseModel:PagedResponseDTO<MaterialRequestModel[]>={
    results:[],
    filterList:[],
    pageSize: 10,
    currentPage:1,
    searchText:''

  };
  branchesSelectorData: GeneralSelectorModel[] = [];
  constructor(private offcanvasService: NgbOffcanvas,
              private purchaseService: PurchaseService,
              private inventoryService: InventoryService,
              private sharedService: SharedService,
              private toaster: ToastrService) { }


  ngOnInit(): void {
    this.GetBranchesData();
  }
  GetBranchesData() {
    this.sharedService.GetBranchesSelector().subscribe(data => {
      this.branchesSelectorData = data;
    });
  }


  loadData()
  {
    if (!this.selectedBranchId &&!this.orderDate&&!this.orderNumber) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }

    this.mapFilters();
    this.showLoader=true;
    this.inventoryService.GetMaterialRequests_Data(this.pagedResponseModel).subscribe((data:PagedResponseDTO<MaterialRequestModel[]>) => {
      // console.log("data",data);
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
    
  }
  mapFilters() {
    this.pagedResponseModel.filterList=[];
    if (this.orderDate) {
      this.pagedResponseModel.filterList.push({categoryName:'OrderDate',itemFlag:this.orderDate})
    }
    if (this.selectedBranchId) {
      this.pagedResponseModel.filterList.push({categoryName:'BranchId',itemFlag:this.selectedBranchId})
    }
    if (this.orderNumber) {
      this.pagedResponseModel.filterList.push({categoryName:'searchText',itemFlag:this.orderNumber})
    }
    // this.pagedResponseModel.filterList.push({categoryName:'IsLocked',itemFlag:'0'})

  }
  OpenSidePanel(content: any) {
    this.pagedResponseModel.results=[];
    this.offcanvasService.open(content, {panelClass: 'details-panel', position: 'end' });
  }


  SelectOrder(ord)
  {
    this.offcanvasService.dismiss();
    this.selectedMaterialRequest.emit([ord]);
    // this.selectedMaterialRequest.emit(ord);
  }
  SelectOrders()
  {
    var checkedItems = this.pagedResponseModel.results.filter(b => b.isChecked &&b.materialRequestId);
    if (checkedItems.length <= 0) {
      this.toaster.warning('يجب الاختبار من طلبات الشراء');
      return;
    }
    this.offcanvasService.dismiss();
    this.selectedMaterialRequest.emit(checkedItems);
  }
  selectAllData() {
    if (this.pagedResponseModel.results && this.pagedResponseModel.results.length > 0) {
      this.pagedResponseModel.results.map(c => {
        c.isChecked = this.selectAll;
      });
    }

  }
}


