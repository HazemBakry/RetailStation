import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseInvoiceDetails } from '../../models/PurchaseInvoiceDetailsModel';

@Component({
  selector: 'app-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.css']
})
export class OrderProductsComponent implements OnInit , OnChanges {
  @Input() selectedSupplierProducts:any[]=[];
  @Input() clearAllProducts:boolean=false;
  @Input() showAddNew:boolean=true;
  @Output() selectedProductsList =new EventEmitter<any[]>();

  productsList:any[]=[];
  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  LookupsList: any[] = [];
  ItemsList: any[] = [];
  ItemsByLookup: any[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  EditQuantityList: any[] = [];
  selectedItem: PurchaseInvoiceDetails = {};
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;


  constructor(private purchaseService: PurchaseService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.AddSupplierProducts();
  }
  ngOnChanges(changes: any): void {
    if (changes&&changes.selectedSupplierProducts) {
      this.AddSupplierProducts();
    }
    
    if (changes&&changes.clearAllProducts&&!changes.clearAllProducts?.firstChange) {
      this.productsList=[];
    }
  }
  AddSupplierProducts()
  {
    this.selectedSupplierProducts.forEach(item => {
      let checked = this.productsList?.find(i => i.itemID == item.itemID);
      if (!checked)
        this.productsList.push(item);
    });
    this.emitSelectedProductsList();
  }
  GetItemsData() {
    this.purchaseService.GetItemsData().subscribe(data => {
      this.ItemsList = data;
    });
  }
  GetItemLookupsData() {
    this.purchaseService.GetItemLookupsData().subscribe(data => {
      this.LookupsList = data;
    });
  }
  openItemsModal(content: any) {
    this.selectedItem = {};
    this.GetItemsData();
    this. GetItemLookupsData();
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  openEditQuantityModal(content: any) {
    if (this.productsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList = [];
    this.productsList.forEach(item => {
      let newObj = JSON.parse(JSON.stringify(item));
      this.EditQuantityList.push(newObj);
    });
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  RemoveItem(index: number) {
    this.productsList.splice(index, 1);
    this.emitSelectedProductsList();
  }
  ItemTypeChange(name) {
    if (name == 'Item')
      this.activeTab = 'Item';
    else
      this.activeTab = 'Lookups';
  }
  SaveSelectedItem() {
    if (this.activeTab == 'Item') {
      if (this.selectedItem.itemID) {
        let checked = this.productsList.find(i => i.itemID == this.selectedItem.itemID);
        if (!checked)
          this.productsList.push(this.selectedItem);
        else
          this.toaster.warning(this.selectedItem.itemName + ' Is Exist In Purchase Item List')
        this.modalService.dismissAll();
      }
      else
        this.toaster.warning('Please Select Item Or Lookups');
    } else {
      this.ItemsByLookup.forEach(item => {
        let itemChecked = this.productsList.find(i => i.itemID == item.itemID);
        if (!itemChecked) {
          this.productsList.push(item);
        } else {
          this.toaster.warning(item.itemName + ' Is Exist In Purchase Item List');
        }
      });
      this.modalService.dismissAll();
    }
    this.emitSelectedProductsList();
  }
  GetSelectedItem(item: any) {
    this.selectedItem.purchaseInvoiceDetailsID = 0;
    this.selectedItem.purchaseInvoiceID = 0;
    this.selectedItem.itemID = item.itemId;
    this.selectedItem.itemName = item.nameEN;
    this.selectedItem.unitID = item.unitId;
    this.selectedItem.unitName = item.unitName;
    this.selectedItem.price = item.cost;
    this.selectedItem.quantity = 0;
    this.selectedItem.totalValue = item.cost;
  }
  GetSelectedLookup(item: any) {
    const lookupId=item.itemLookupId;
    this.purchaseService.GetItemsByLookupId(lookupId).subscribe(data => {
      let Items: any[] = data;
      this.ItemsByLookup = Items.map<PurchaseInvoiceDetails>(item => {
        {
          return {
            purchaseInvoiceDetailsID: 0,
            purchaseInvoiceID: 0,
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
  ChangeNewQuantity() {
    if (this.EditQuantityList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList.forEach(item => {
      let Item = this.productsList.find(i => i.itemID == item.itemID);
      Item.quantity = item.quantity;
      Item.totalValue = item.price * item.quantity;
    });
    this.emitSelectedProductsList();
    this.modalService.dismissAll();
  }
  emitSelectedProductsList()
  {
    var list=this.productsList.filter(x=>x.quantity&&x.quantity>0);
    this.selectedProductsList.emit(list);
  }
}
