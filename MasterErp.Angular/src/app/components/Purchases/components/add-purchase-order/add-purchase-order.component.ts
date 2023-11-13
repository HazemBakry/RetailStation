import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { PurchaseOrderModel } from '../../models/PurchaseOrder';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})
export class AddPurchaseOrderComponent implements OnInit {

  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: any[] = [];
  notes: any;
  BranchId: any;
  SupplierId: any;
  ItemsBySupplier: any[] = [];
  InvoiceNumber = '-';
  BranchName = 'الفروع';
  SupplierName = 'الموردين';
  clearAllProducts:boolean=false; 
  constructor(private purchaseService: PurchaseService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetBranchesData();
    this.GetSuppliersData();
  }

  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }

  GetBranchesData() {
    this.purchaseService.GetBranchesData().subscribe(data => {
      this.BranchesList = data;
    });
  }

  GetSelectedBranch(item: any) {
    this.BranchId = item.branchId;
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierId;

  }
  GetSelectedProductsList(products:any[])
  {
    this.ProductsList=products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }
  CreateNewPurchaseOrder() {
    if (!this.BranchId) {
      this.toaster.warning('Please Select Branch');
      return;
    }

    if (this.ProductsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }

    let model: PurchaseOrderModel = {} as PurchaseOrderModel;

    model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.purchaseService.CreateNewPurchaseOrder(model).subscribe((data:CreateModifyReturnsModel) => {
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
    this.purchaseService.GetItemsBySupplierId(this.SupplierId).subscribe(data => {
      this.ItemsBySupplier=data;
      // let Items: any[] = data;
      // this.ItemsBySupplier = Items.map<PurchaseInvoiceDetails>(item => {
      //   {
      //     return {
      //       purchaseInvoiceDetailsID: 0,
      //       purchaseInvoiceID: 0,
      //       itemID: item.itemID,
      //       itemName: item.nameEN,
      //       unitID: item.unitID,
      //       unitName: item.unitNameEn,
      //       price: item.price,
      //       quantity: item.quantity,
      //       totalValue: item.price
      //     }
      //   };
      // });
    });
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
    this.InvoiceNumber = '-';
    this.SupplierId = '';
    this.BranchId = '';
    this.BranchId = '';
    // this.activeTab = 'Item'
    this.notes = '';
    this.BranchName = 'الفروع';
    this.SupplierName = 'الموردين';
    this.ProductsList = [];
    this.clearAllProducts=!this.clearAllProducts;
    // this.AddNewItem = {};
    // this.EditQuantityList = [];
  }
}
