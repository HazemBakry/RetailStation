import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Finance/Purchase/services/purchase.service';
import { ReceiveOrderModel } from '../../models/inventory';

@Component({
  selector: 'app-create-receive-order',
  templateUrl: './create-receive-order.component.html',
  styleUrls: ['./create-receive-order.component.css']
})




export class CreateReceiveOrderComponent implements OnInit {

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
  constructor(private inventoryService: InventoryService,private purchaseService: PurchaseService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetInventoryList();
    this.GetSuppliersData();
  }

  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }
  GetInventoryList() {
    this.inventoryService.GetInventoryList().subscribe(data => {
      this.InventoryList = data;
    });
  }
  GetBranchesData() {
    this.purchaseService.GetBranchesData().subscribe(data => {
      this.BranchesList = data;
    });
  }

  GetSelectedBranch(item: any) {
    this.BranchId = item.branchID;
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;

  }
  GetSelectedInventory(item: any) {
    this.InventoryId = item.inventoryId;

  }
  GetSelectedProductsList(products:any[])
  {
    this.ProductsList=products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }
  SaveNewPurchaseOrder() {
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
    
    let model: ReceiveOrderModel = {} as ReceiveOrderModel;
    // model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.inventoryId = this.InventoryId;
    model.purchaseOrderId=this.selectedOrder?.purchaseOrderId;
    model.orderNumber=this.selectedOrder?.orderNumber;
    model.totalValue=this.selectedOrder?.totalValue;
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.inventoryService.SaveNewReceiveOrder(model).subscribe(data => {
      if (data?.status) {
        this.ClearAllFields();
        // this.InvoiceNumber = data.item2;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });

  }

  LoadItemsBySupplier() {
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }

    // this.ItemsBySupplier.forEach(item => {
    //   let itemChecked = this.RawItemsList.find(i => i.itemID == item.itemID);
    //   if (!itemChecked) {
    //     this.RawItemsList.push(item);
    //   } else {
    //     this.toaster.warning(item.itemName + ' Is Exist In Purchase Item List');
    //   }
    // });

  }
  ClearAllFields() {
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

  SelectOrder(ord){
    this.selectedOrder=ord;
    this.OrderNumber=this.selectedOrder?.orderNumber;
    this.ItemsBySupplier=this.selectedOrder?.items;


    // this.ItemsBySupplier = this.selectedOrder?.items?.map(item => {
    //   {
    //     return {
    //       purchaseInvoiceDetailsID: item.purchaseInvoiceDetailsId,
    //       purchaseInvoiceID: item.purchaseInvoiceId,
    //       itemID: item.itemId,
    //       itemName: item.itemNameEN,
    //       unitID: item.unitID,
    //       unitName: item.unitNameEn,
    //       price: item.price,
    //       quantity: item.quantity,
    //       totalValue: item.itemTotalValue
    //     }
    //   }
    // })
    // console.log("this.ItemsBySupplier",this.ItemsBySupplier);
    
  }
}