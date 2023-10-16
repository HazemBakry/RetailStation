import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseInvoiceDetails } from '../../models/PurchaseInvoiceDetailsModel';
import { ToastrService } from 'ngx-toastr';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';
import { ItemModel } from 'src/app/Models/ItemModel';

@Component({
  selector: 'app-create-purchases-invoice',
  templateUrl: './create-purchases-invoice.component.html',
  styleUrls: ['./create-purchases-invoice.component.css']
})

export class CreatePurchasesInvoiceComponent implements OnInit {
  SuppliersList: any[] = [];
  InvoiceTypesList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: ItemModel[] = [];
  ItemsBySupplier: ItemModel[] = [];
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  InvoiceTypeId: any;
  InvoiceNumber = '-';
  BranchName = 'الفروع';
  SupplierName = 'الموردين';
  TypeName = 'نوع الفاتورة';
  clearAllProducts:boolean=false;



  constructor(private purchaseService: PurchaseService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetBranchesData();
    this.GetSuppliersData();
    this.GetInvoiceTypesData();
    
  }

  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }
  GetInvoiceTypesData() {
    this.purchaseService.GetInvoiceTypesData().subscribe(data => {
      this.InvoiceTypesList = data;
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

  GetSelectedInvoiceType(item: any) {
    this.InvoiceTypeId = item.invoiceTypeId;

  }
  GetSelectedProductsList(products:any[])
  {
    this.ProductsList=products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }

  LoadItemsBySupplier() {
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }
    this.purchaseService.GetItemsBySupplierId(this.SupplierId).subscribe(data => {
      let Items: ItemModel[] = data;
      this.ItemsBySupplier=Items;
      // this.ItemsBySupplier = Items.map<PurchaseInvoiceDetails>(item => {
      //   {
      //     return {
      //       purchaseInvoiceDetailsID: 0,
      //       purchaseInvoiceID: 0,
      //       itemID: item.itemID,
      //       itemName: item.nameEN,
      //       unitID: item.unitID,
      //       unitName: item.unitNameEn,
      //       price: item.cost,
      //       quantity: item.quantity,
      //       totalValue: item.cost
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

  SaveNewPurchaseOrder() {
    if (!this.BranchId) {
      this.toaster.warning('Please Select Branch');
      return;
    }
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }
    if (!this.InvoiceTypeId) {
      this.toaster.warning('Please Select Invoice Type');
      return;
    }
    if (this.ProductsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }


    let model: PurchaseInvoiceModel = {} as PurchaseInvoiceModel;

    model.purchaseInvoiceId = 0;
    model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.InvoiceTypeId = this.InvoiceTypeId;
    model.userId = 0;
    model.notes = this.notes;
    model.items = this.ProductsList;

    
    this.purchaseService.SaveNewPurchaseInvoice(model).subscribe(data => {
      if (data?.status) {
        this.ClearAllFields();
        // this.InvoiceNumber = data.item2;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });


  }

}
