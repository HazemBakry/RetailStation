import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { OrderModel } from '../../models/inventory';

@Component({
  selector: 'app-add-receive-order',
  templateUrl: './add-receive-order.component.html',
  styleUrls: ['./add-receive-order.component.css']
})

export class AddReceiveOrderComponent implements OnInit {
  SuppliersList: any[] = [];
  InventoryList:any[]=[];
  BranchesList: any[] = [];
  ProductsList: any[] = [];
  notes: any;
  BranchId: any;
  SupplierId: any;
  InventoryId: any;
  ItemsBySupplier: any[] = [];
  OrderNumber :any;
  BranchName = 'الفروع';
  InventoryName = 'المخازن';
  SupplierName = 'الموردين';
  clearAllProducts:boolean=false;

  selectedOrder:any;
  constructor(private inventoryService: InventoryService,
    private purchaseService: PurchaseService, 
    private modalService: NgbModal, 
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    debugger;
    this.getInventoryList();
    this.getSuppliersData();
  }

  getSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }

  getInventoryList() {
    this.inventoryService.GetInventoryList().subscribe(data => {
      this.InventoryList = data;
    });
  }

  getBranchesData() {
    this.purchaseService.GetBranchesData().subscribe(data => {
      this.BranchesList = data;
    });
  }

  getSelectedBranch(item: any) {
    this.BranchId = item.branchId;
  }

  getSelectedSupplier(item: any) {
    this.SupplierId = item.supplierId;

  }

  getSelectedInventory(item: any) {
    this.InventoryId = item.inventoryId;
  }

  getSelectedProductsList(products:any[])
  {
    this.ProductsList=products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }

  addNewReceiveOrder() {
    if (!this.InventoryId) {
      this.toaster.warning('Please Select Inventory');
      return;
    }

    if (this.ProductsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    if (!this.selectedOrder) {
      this.toaster.warning('Please Enter Invoice');
      return;
    }
    
    let model: OrderModel = {} as OrderModel;
    // model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.inventoryId = this.InventoryId;
    model.purchaseOrderId=this.selectedOrder?.purchaseOrderId;
    model.orderNumber=this.selectedOrder?.orderNumber;
    model.totalValue=this.selectedOrder?.totalValue;
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.inventoryService.CreateNewReceiveOrder(model).subscribe(data => {
      if (data?.status) {
        this.clearAllFields();
        // this.InvoiceNumber = data.item2;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });

  }

  loadItemsBySupplier() {
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }
  }

  clearAllFields() {
    this.OrderNumber ='';
    this.SupplierId = '';
    this.BranchId = '';
    this.BranchId = '';
    // this.activeTab = 'Item'
    this.notes = '';
    this.BranchName = 'الفروع';
    this.SupplierName = 'الموردين';
    this.ProductsList = [];
    this.clearAllProducts=!this.clearAllProducts;
    this.selectedOrder=null;
    // this.AddNewItem = {};
    // this.EditQuantityList = [];
  }

  selectOrder(ord){
    this.selectedOrder=ord;
    this.OrderNumber=this.selectedOrder?.orderNumber;
    this.ItemsBySupplier=this.selectedOrder?.items;
  }
}