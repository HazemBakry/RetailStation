import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseInvoiceDetails } from '../../models/PurchaseInvoiceDetailsModel';
import { ToastrService } from 'ngx-toastr';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-add-purchase-invoice',
  templateUrl: './add-purchase-invoice.component.html',
  styleUrls: ['./add-purchase-invoice.component.css']
})

export class AddPurchaseInvoiceComponent implements OnInit {
  SuppliersList: any[] = [];
  InvoiceTypesList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: OrderDetailModel[] = [];
  ItemsBySupplier: ItemModel[] = [];
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  InvoiceTypeId: any;
  InvoiceDate: any;
  InvoiceNumber = '-';
  DocNumber: any;
  BranchName = 'الفروع';
  SupplierName = 'الموردين';
  TypeName = 'نوع الفاتورة';
  showLoader: boolean;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  clearAllProducts: boolean = false;

  constructor(private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetBranchesData();
    this.GetSuppliersData();
    this.GetInvoiceTypesData();

  }

  GetSuppliersData() {
    this.purchaseService.GetSuppliersData(this.FilterModel).subscribe(data => {
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
    this.BranchId = item.branchId;
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierId;

  }

  GetSelectedInvoiceType(item: any) {
    this.InvoiceTypeId = item.invoiceTypeId;
  }

  GetSelectedProductsList(products: any[]) {
    this.ProductsList = products;
  }

  LoadSupplierItems() {
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }
    this.inventoryService.GetItemsBySupplierId(this.SupplierId).subscribe(data => {
      let Items: ItemModel[] = data;
      this.ItemsBySupplier = Items;
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
    this.clearAllProducts = !this.clearAllProducts;
    // this.AddNewItem = {};
    // this.EditQuantityList = [];
  }

  CreateNewPurchaseOrder() {
    // if (!this.BranchId) {
    //   this.toaster.warning('Please Select Branch');
    //   return;
    // }
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
    model.docNumber = this.DocNumber;
    model.invoiceDate = this.InvoiceDate;
    model.items = this.ProductsList;
    this.showLoader = true;
    this.purchaseService.CreateNewPurchaseInvoice(model).subscribe(data => {
      if (data?.status) {
        this.ClearAllFields();
        // this.InvoiceNumber = data.item2;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    });


  }

  PrintOrder() {

  }
}
