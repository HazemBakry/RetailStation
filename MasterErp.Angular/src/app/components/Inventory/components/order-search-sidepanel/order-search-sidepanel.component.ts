import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

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
  SupplierName = 'الموردين';
  orderNumber:string = '';
  orderDate:string ;

  constructor(private offcanvasService: NgbOffcanvas,
              private purchaseService: PurchaseService,
              private inventoryService: InventoryService,
              private toaster: ToastrService) { }


  ngOnInit(): void {
    this.GetSuppliersData();
  }
  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;
  }

  loadData()
  {
    if (!this.orderDate&&!this.SupplierId&&!this.orderNumber) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }

    this.showLoader=true;

    this.inventoryService.GetOrdersSearchData(this.SupplierId,this.orderNumber,this.orderDate).subscribe(data => {
      // console.log("data",data);
      this.OrdersList=data;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
    
    
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

