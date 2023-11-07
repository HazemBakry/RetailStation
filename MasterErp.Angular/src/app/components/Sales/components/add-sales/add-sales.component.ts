import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../services/sales.service';
import { SalesInvoiceDetails, SalesInvoiceModel } from '../../models/SalesInvoiceModel';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.css']
})
export class AddSalesComponent implements OnInit {
  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  LookupsList: any[] = [];
  ItemsList: any[] = [];
  ItemsByLookup: any[] = [];
  ItemsBySupplier: any[] = [];
  RawItemsList: any[] = [];
  EditQuantityList: any[] = [];
  AddNewItem: SalesInvoiceDetails = {};
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;
  InvoiceNumber = '-';
  BranchName = 'الفروع';
  SupplierName = 'الموردين';



  constructor(private purchaseService: PurchaseService, private modalService: NgbModal, private toaster: ToastrService,
    private salesService: SalesService) { }

  ngOnInit(): void {
    this.GetSuppliersData();
    this.GetBranchesData();
    this.GetItemsData();
    this.GetItemsLookups();
  }

  openItemsModal(content: any) {
    this.AddNewItem = {};
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  openEditQuantityModal(content: any) {
    if (this.RawItemsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList = [];
    this.RawItemsList.forEach(item => {
      let newObj = JSON.parse(JSON.stringify(item));
      this.EditQuantityList.push(newObj);
    });
    this.modalService.open(content, { centered: true, size: 'md' });
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

  GetItemsLookups() {
    this.purchaseService.GetItemsLookups().subscribe(data => {
      this.LookupsList = data;
    });
  }

  GetItemsData() {
    this.purchaseService.GetItemsData().subscribe(data => {
      this.ItemsList = data;
    });
  }

  GetSelectedBranch(item: any) {
    this.BranchId = item.branchID;
  }

  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;
    this.purchaseService.GetItemsBySupplierId(item.supplierID).subscribe(data => {
      let Items: any[] = data;
      this.ItemsBySupplier = Items.map<SalesInvoiceDetails>(item => {
        {
          return {
            salesInvoiceDetailsID: 0,
            salesInvoiceID: 0,
            itemID: item.itemID,
            itemName: item.nameEN,
            unitID: item.unitID,
            unitName: item.unitNameEn,
            price: item.price,
            quantity: item.quantity,
            totalValue: item.price
          }
        };
      });
    });
  }

  GetSelectedItem(item: any) {
    this.AddNewItem.salesInvoiceDetailsID = 0;
    this.AddNewItem.salesInvoiceID = 0;
    this.AddNewItem.itemID = item.itemId;
    this.AddNewItem.itemName = item.nameEN;
    this.AddNewItem.unitID = item.unitId;
    this.AddNewItem.unitName = item.unitName;
    this.AddNewItem.price = item.cost;
    this.AddNewItem.quantity = 0;
    this.AddNewItem.totalValue = item.cost;
  }

  GetSelectedLookup(item: any) {
    this.purchaseService.GetItemsByLookupId(item.itemLookupId).subscribe(data => {
      let Items: any[] = data;
      this.ItemsByLookup = Items.map<SalesInvoiceDetails>(item => {
        {
          return {
            salesInvoiceDetailsID: 0,
            salesInvoiceID: 0,
            itemID: item.itemID,
            itemName: item.nameEN,
            unitID: item.unitID,
            unitName: item.unitNameEn,
            price: item.cost,
            quantity: item.quantity,
            totalValue: item.cost
          }
        };
      });
    });
  }

  LoadItemsBySupplier() {
    if (!this.SupplierId) {
      this.toaster.warning('Please Select Supplier');
      return;
    }

    this.ItemsBySupplier.forEach(item => {
      let itemChecked = this.RawItemsList.find(i => i.itemID == item.itemID);
      if (!itemChecked) {
        this.RawItemsList.push(item);
      } else {
        this.toaster.warning(item.itemName + ' Is Exist In Purchase Item List');
      }
    });

  }

  SaveSelectedItem() {
    if (this.activeTab == 'Item') {
      if (this.AddNewItem.itemID) {
        let checked = this.RawItemsList.find(i => i.itemID == this.AddNewItem.itemID);
        if (!checked)
          this.RawItemsList.push(this.AddNewItem);
        else
          this.toaster.warning(this.AddNewItem.itemName + ' Is Exist In Purchase Item List')
        this.modalService.dismissAll();
      }
      else
        this.toaster.warning('Please Select Item Or Lookups');
    } else {
      this.ItemsByLookup.forEach(item => {
        let itemChecked = this.RawItemsList.find(i => i.itemID == item.itemID);
        if (!itemChecked) {
          this.RawItemsList.push(item);
        } else {
          this.toaster.warning(item.itemName + ' Is Exist In Purchase Item List');
        }
      });
      this.modalService.dismissAll();
    }

  }

  ChangeNewQuantity() {
    if (this.EditQuantityList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList.forEach(item => {
      let Item = this.RawItemsList.find(i => i.itemID == item.itemID);
      Item.quantity = item.quantity;
      Item.totalValue = item.price * item.quantity;
    });
    this.modalService.dismissAll();
  }

  RemoveItem(index: number) {
    this.RawItemsList.splice(index, 1);
  }

  ClearAllFields() {
    this.InvoiceNumber = '-';
    this.SupplierId = '';
    this.BranchId = '';
    this.BranchId = '';
    this.activeTab = 'Item'
    this.notes = '';
    this.BranchName = 'الفروع';
    this.SupplierName = 'الموردين';
    this.RawItemsList = [];
    this.AddNewItem = {};
    this.EditQuantityList = [];
  }

  ItemTypeChange(name) {
    if (name == 'Item')
      this.activeTab = 'Item';
    else
      this.activeTab = 'Lookups';
  }


  SaveNewPurchaseOrder() {
    if (!this.BranchId) {
      this.toaster.warning('Please Select Branch');
      return;
    }

    if (this.RawItemsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }

    let model: SalesInvoiceModel = {} as SalesInvoiceModel;
    model.salesInvoiceId = 0;
    model.branchId = this.BranchId;
    model.userId = 0;
    model.notes = this.notes;
    model.items = this.RawItemsList;

    this.salesService.SaveNewSalesInvoice(model).subscribe(data => {
      if (data.item1) {
        this.ClearAllFields();
        this.InvoiceNumber = data.item2;
        this.toaster.success('New Sales Saved Successfully');
      } else {
        this.toaster.error('New Sales Saved Failed');
      }
    });

  }
}
