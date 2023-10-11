import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseInvoiceDetails } from '../../models/PurchaseInvoiceDetailsModel';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';
import { PurchaseReturnsModel } from '../../models/PurchaseReturns';
@Component({
  selector: 'app-create-purchases-returns',
  templateUrl: './create-purchases-returns.component.html',
  styleUrls: ['./create-purchases-returns.component.css']
})

export class CreatePurchasesReturnsComponent implements OnInit {

  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: any[] = [];
  notes: any;
  BranchId: any;
  SupplierId: any;
  ItemsBySupplier: any[] = [];
  InvoiceNumber = '';
  BranchName = 'الفروع';
  SupplierName = 'الموردين';
  clearAllProducts:boolean=false;

  selectedInvoice:any;
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
    this.BranchId = item.branchID;
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;

  }
  GetSelectedProductsList(products:any[])
  {
    this.ProductsList=products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }
  SaveNewPurchaseOrder() {
    if (!this.BranchId) {
      this.toaster.warning('Please Select Branch');
      return;
    }

    if (this.ProductsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    if (!this.selectedInvoice) {
      this.toaster.warning('Please Enter Invoice');
      return;
    }
    
    let model: PurchaseReturnsModel = {} as PurchaseReturnsModel;
    model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.invoiceId=this.selectedInvoice?.invoiceId
    model.invoiceNumber=this.selectedInvoice?.invoiceNumber
    model.invoiceTypeId=this.selectedInvoice?.invoiceTypeId
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.purchaseService.SaveNewPurchaseReturns(model).subscribe(data => {
      if (data.item1) {
        this.ClearAllFields();
        this.InvoiceNumber = data.item2;
        this.toaster.success('New Purchase Saved Successfully');
      } else {
        this.toaster.error('New Purchase Saved Failed');
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
    this.selectedInvoice=null;
    // this.AddNewItem = {};
    // this.EditQuantityList = [];
  }

  SelectInvoice(inv){
    this.selectedInvoice=inv;
    // console.log("inv",inv);
    this.InvoiceNumber=this.selectedInvoice?.invoiceNumber;
    this.ItemsBySupplier = this.selectedInvoice?.items?.map(item => {
      {
        return {
          purchaseInvoiceDetailsID: item.purchaseInvoiceDetailsId,
          purchaseInvoiceID: item.purchaseInvoiceId,
          itemID: item.itemId,
          itemName: item.itemNameEN,
          unitID: item.unitID,
          unitName: item.unitNameEn,
          price: item.price,
          quantity: item.quantity,
          totalValue: item.itemTotalValue
        }
      }
    })
    console.log("this.ItemsBySupplier",this.ItemsBySupplier);
    
  }
}
