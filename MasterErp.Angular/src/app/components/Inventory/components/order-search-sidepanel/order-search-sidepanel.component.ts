import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';

@Component({
  selector: 'app-order-search-sidepanel',
  templateUrl: './order-search-sidepanel.component.html',
  styleUrls: ['./order-search-sidepanel.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class OrderSearchSidepanelComponent implements OnInit {
  @Input() selectedSupplierId: any;

  @Output() selectedOrder=new EventEmitter<any>()
  OrdersList: any[] = [];
  showLoader: boolean;


  SuppliersList: any[] = [];
  SupplierId: any;
  SupplierName = 'الموردين';
  orderNumber:string = '';
  orderDate:string ;
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  suppliersSelectorData: FormDropdownModel[] = [];
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
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierId;
  }

  loadData()
  {
    if (!this.orderDate&&!this.selectedSupplierId&&!this.orderNumber) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }

    this.mapFilters();
    this.showLoader=true;
    this.purchaseService.GetPurchaseOrders_Data(this.pagedResponseModel).subscribe((data:PagedResponseDTO<OrderModel[]>) => {
      // console.log("data",data);
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });


    // this.inventoryService.GetOrdersSearchData(this.SupplierId,this.orderNumber,this.orderDate).subscribe(data => {
    //   // console.log("data",data);
    //   this.OrdersList=data;
    //   this.showLoader=false;
    // },(err)=>{
    //   this.showLoader=false;
    // },()=>{
    //   this.showLoader=false;
    // });
    
    
  }
  mapFilters() {
    this.pagedResponseModel.filterList=[];
    if (this.orderDate) {
      this.pagedResponseModel.filterList.push({categoryName:'OrderDate',itemFlag:this.orderDate})
    }
    if (this.selectedSupplierId) {
      this.pagedResponseModel.filterList.push({categoryName:'SupplierId',itemFlag:this.selectedSupplierId})
    }
    if (this.orderNumber) {
      this.pagedResponseModel.filterList.push({categoryName:'SearchText',itemFlag:this.orderNumber})
    }

  }
  OpenSidePanel(content: any) {
    if(!this.selectedSupplierId)
    {
      this.toaster.warning('يجب تحديد المورد');
      return;
    }
    this.pagedResponseModel.results=[];
    this.offcanvasService.open(content, {panelClass: 'details-panel', position: 'end' });
  }


  SelectOrder(ord)
  {

    this.offcanvasService.dismiss();

    this.selectedOrder.emit(ord);
  }
}

