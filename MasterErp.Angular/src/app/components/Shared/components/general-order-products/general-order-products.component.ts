import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { FilterModel, SearchFilterModel } from '../../models/FilterModel';
import { OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { FormDropdownModel } from '../drop-down-form-control/drop-down-form-control.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-general-order-products',
  templateUrl: './general-order-products.component.html',
  styleUrls: ['./general-order-products.component.css']
})
export class GeneralOrderProductsComponent implements OnInit, OnChanges {
  @Input() selectedProducts: OrderProductModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() showAddNew: boolean = false;
  @Output() selectedProductsList = new EventEmitter<OrderProductModel[]>();


  showLoader: boolean = false;
  productsList: OrderProductModel[] = [];
  itemsLookupsSelectorData: FormDropdownModel[] = [];
  ItemsList: any[] = [];
  itemsByLookup: OrderProductModel[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  editQuantityList: OrderProductModel[] = [];
  selectedItem: OrderProductModel;
  // selectedItem: any={} ;
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.addProducts();
  }
  ngOnChanges(changes: any): void {
    if (changes && changes.selectedProducts) {
      this.addProducts();
    }

    if (changes && changes.clearAllProducts && !changes.clearAllProducts?.firstChange) {
      this.productsList = [];
    }
  }
  addProducts() {

    this.selectedProducts.forEach(item => {
      let checked = this.productsList?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.productsList.push(item);
    });
    this.emitSelectedProductsList();
  }
  getItemsData() {
    this.inventoryService.GetItemsData(this.SearchFilterModel).subscribe(data => {
      this.ItemsList = data.results;
    });
  }
  getItemsLookups() {
    this.sharedService.GetItemLookupsSelector().subscribe(data => {
      this.itemsLookupsSelectorData = data;
    });
  }
  openItemsModal(content: any) {
    this.selectedItem = {} as OrderProductModel;
    this.getItemsData();
    this.getItemsLookups();
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  openEditQuantityModal(content: any) {
    if (this.productsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.editQuantityList = [];
    this.productsList.forEach(item => {
      let newObj = JSON.parse(JSON.stringify(item));
      this.editQuantityList.push(newObj);
    });
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  removeItem(itemId: number) {
    // this.productsList.splice(index, 1);
    this.productsList = this.productsList.filter(p => p.itemId != itemId);
    this.emitSelectedProductsList();
  }
  itemTypeChange(name) {
    if (name == 'Item')
      this.activeTab = 'Item';
    else
      this.activeTab = 'Lookups';
  }
  saveSelectedItem() {
    this.selectedItem.totalValue = this.selectedItem.price && this.selectedItem.quantity ? this.selectedItem.price * this.selectedItem.quantity : 0;

    if (this.activeTab == 'Item') {
      if (this.selectedItem.itemId) {
        let checked = this.productsList.find(i => i.itemId == this.selectedItem.itemId);
        if (!checked)
          this.productsList.push(this.selectedItem);
        else
          this.toaster.warning(this.selectedItem.itemNameAR + ' Is Exist In Purchase Item List')
        this.modalService.dismissAll();
      }
      else
        this.toaster.warning('Please Select Item Or Lookups');
    } else {
      this.itemsByLookup.forEach(item => {
        let itemChecked = this.productsList.find(i => i.itemId == item.itemId);
        if (!itemChecked) {
          this.productsList.push(item);
        } else {
          this.toaster.warning(item.itemNameAR + ' is already exist');
        }
      });
      this.modalService.dismissAll();
    }
    this.emitSelectedProductsList();
  }
  getSelectedItem(item: OrderProductModel) {

    // let model: ItemModel = {} as ItemModel;
    this.selectedItem.itemId = item.itemId;
    this.selectedItem.itemNameAR = item.itemNameAR;
    this.selectedItem.itemNameEN = item.itemNameEN;
    this.selectedItem.unitId = item.unitId;
    this.selectedItem.unitNameAR = item.unitNameAR;
    this.selectedItem.unitNameEN= item.unitNameEN;
    this.selectedItem.price = item.price;
    this.selectedItem.quantity = 0;
    this.selectedItem.totalValue = item.price && item.quantity ? item.price * item.quantity : 0;

    // this.selectedItem=model;
  }
  getSelectedLookup(lookupId: any) {
    this.inventoryService.GetItemsByLookupId(lookupId).subscribe(data => {
      let Items: any[] = data;
      this.itemsByLookup = Items;
    });
  }
  changeNewQuantity() {
    if (this.editQuantityList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.editQuantityList.forEach(item => {
      let Item = this.productsList.find(i => i.itemId == item.itemId);
      Item.quantity = item.quantity;
      Item.totalValue = item.price * item.quantity;
    });
    this.emitSelectedProductsList();
    this.modalService.dismissAll();
  }
  emitSelectedProductsList() {
    var list = this.productsList.filter(x => x.quantity && x.quantity > 0);
    this.selectedProductsList.emit(list);
  }
}

