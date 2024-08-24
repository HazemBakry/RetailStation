import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
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

  @Output() selectedOrder=new EventEmitter<any>()
  OrdersList: any[] = [];
  showLoader: boolean;


  SuppliersList: any[] = [];
  SupplierId: any;
  selectedSupplierId: any;
  SupplierName = 'الموردين';
  orderNumber:string = '';
  orderDate:string ;
  pagerResponseResponse:PagedResponseDTO<OrderModel[]>={
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
    this.purchaseService.GetPurchaseOrders_Data(this.pagerResponseResponse).subscribe((data:PagedResponseDTO<OrderModel[]>) => {
      // console.log("data",data);
      this.pagerResponseResponse.results=data.results;
      this.pagerResponseResponse.totalCount=data.totalCount;
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
    this.pagerResponseResponse.filterList=[];
    if (this.orderDate) {
      this.pagerResponseResponse.filterList.push({categoryName:'OrderDate',itemFlag:this.orderDate})
    }
    if (this.selectedSupplierId) {
      this.pagerResponseResponse.filterList.push({categoryName:'SupplierId',itemFlag:this.selectedSupplierId})
    }
    if (this.orderNumber) {
      this.pagerResponseResponse.filterList.push({categoryName:'OrderNumber',itemFlag:this.orderNumber})
    }

  }
  OpenSidePanel(content: any) {
    this.offcanvasService.open(content, {panelClass: 'details-panel', position: 'end' });
  }


  SelectOrder(ord)
  {

    this.offcanvasService.dismiss();

    this.selectedOrder.emit(ord);
  }
}

