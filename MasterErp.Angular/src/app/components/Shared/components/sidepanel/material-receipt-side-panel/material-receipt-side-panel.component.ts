import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { GeneralSelectorModel } from '../../general-selector/general-selector.component';
import { MaterialReceiptModel } from 'src/app/components/Inventory/models/MaterialReceiptModel';

@Component({
  selector: 'app-material-receipt-side-panel',
  templateUrl: './material-receipt-side-panel.component.html',
  styleUrls: ['./material-receipt-side-panel.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class MaterialReceiptSidePanelComponent implements OnInit {
  @Input() selectedSupplierId: any;

  @Output() selectedOrder = new EventEmitter<MaterialReceiptModel[]>()
  OrdersList: any[] = [];
  showLoader: boolean;

  selectAll: boolean = false;
  orderNumber: string = '';
  orderDate: string;
  pagedResponseModel: PagedResponseDTO<MaterialReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''

  };
  suppliersSelectorData: GeneralSelectorModel[] = [];
  constructor(private offcanvasService: NgbOffcanvas,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private toaster: ToastrService) { }


  ngOnInit(): void {
    this.GetSuppliersData();
  }
  GetSuppliersData() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.suppliersSelectorData = data;
    });
  }


  loadData() {
    if (!this.selectedSupplierId && (!this.orderDate || !this.orderNumber)) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }

    this.mapFilters();
    this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Data(this.pagedResponseModel).subscribe((data: PagedResponseDTO<MaterialReceiptModel[]>) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


    // this.inventoryService.GetOrdersSearchData(this.SupplierId,this.orderNumber,this.orderDate).subscribe(data => {
    //   this.OrdersList=data;
    //   this.showLoader=false;
    // },(err)=>{
    //   this.showLoader=false;
    // },()=>{
    //   this.showLoader=false;
    // });


  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }
  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.orderDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'OrderDate', itemFlag: this.orderDate })
    }
    if (this.selectedSupplierId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'SupplierId', itemFlag: this.selectedSupplierId })
    }
    if (this.orderNumber) {
      this.pagedResponseModel.filterList.push({ categoryName: 'SearchText', itemFlag: this.orderNumber })
    }
    this.pagedResponseModel.filterList.push({ categoryName: 'FinalStatus', itemFlag: '0' })

  }
  OpenSidePanel(content: any) {
    this.pagedResponseModel.results = [];
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }


  selectOrder(ord) {
    this.offcanvasService.dismiss();
    this.selectedOrder.emit([ord]);
  }
  selectOrders() {
    var checkedItems = this.pagedResponseModel.results.filter(b => b.isChecked && b.materialReceiptId);
    if (checkedItems.length <= 0) {
      this.toaster.warning('يجب الاختبار من اذونات الاضافة');
      return;
    }
    this.offcanvasService.dismiss();
    this.selectedOrder.emit(checkedItems);
  }
  selectAllData() {
    if (this.pagedResponseModel.results && this.pagedResponseModel.results.length > 0) {
      this.pagedResponseModel.results.map(c => {
        c.isChecked = this.selectAll;
      });
    }

  }
}


