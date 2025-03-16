import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { FilterModel, SearchFilterModel } from '../../models/FilterModel';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { FormDropdownModel } from '../drop-down-form-control/drop-down-form-control.component';
import { SharedService } from '../../services/shared.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit, OnChanges {
  @Input() selectedSupplierProducts: OrderDetailModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() showAddNew: boolean = true;
  @Output() selectedProductsList = new EventEmitter<OrderDetailModel[]>();
  showLoader: boolean = false;
  ItemsList: any[] = [];
  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  LookupsList: any[] = [];
  orderItems: OrderDetailModel[] = [];

  ItemsByLookup: OrderDetailModel[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  EditQuantityList: OrderDetailModel[] = [];
  selectedItem: OrderDetailModel;
  // selectedItem: any={} ;
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;
  itemModel: ItemModel = {} as ItemModel;

  itemsSelector: FormDropdownModel[] = [];
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
    this.AddSupplierProducts();
    this.loadSelector();
  }

  ngOnChanges(changes: any): void {
    if (changes && changes.selectedSupplierProducts) {
      this.AddSupplierProducts();
    }

    if (changes && changes.clearAllProducts && !changes.clearAllProducts?.firstChange) {
      this.orderItems = [];
    }
  }

  loadSelector() {
    this.sharedService.GetItemsSelector().subscribe((data: FormDropdownModel[]) => {
      this.itemsSelector = data;
    });

    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.BranchesList = data;
    });

    this.sharedService.GetSuppliersSelector().subscribe((data: FormDropdownModel[]) => {
      this.SuppliersList = data;
    });

    this.sharedService.GetItemLookupsSelector().subscribe((data: FormDropdownModel[]) => {
      this.LookupsList = data;
    });
  }

  validateNumbers(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }

  getItemDetailsById(itemId) {
    this.inventoryService.GetItemDetailsById(itemId).subscribe((data: ItemModel) => {
      if (data) {
        debugger
        this.itemModel = data;
        //this.initNewForm(this.itemModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  AddSupplierProducts() {
    this.selectedSupplierProducts.forEach(item => {
      let checked = this.orderItems?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.orderItems.push(item);
    });
    this.emitSelectedProductsList();
  }

  GetItemsData() {
    this.inventoryService.GetItemsData(this.SearchFilterModel).subscribe(data => {
      this.ItemsList = data.results;
    });
  }

  GetItemsLookups() {
    this.inventoryService.GetItemsLookups().subscribe(data => {
      this.LookupsList = data;
    });
  }

  openItemsModal(content: any) {
    this.selectedItem = {} as OrderDetailModel;
    this.GetItemsData();
    this.GetItemsLookups();
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  openEditQuantityModal(content: any) {
    if (this.orderItems.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList = [];
    this.orderItems.forEach(item => {
      let newObj = JSON.parse(JSON.stringify(item));
      this.EditQuantityList.push(newObj);
    });
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  RemoveItem(index: number) {
    this.orderItems.splice(index, 1);
    this.emitSelectedProductsList();
  }

  SaveSelectedItem() {
    this.selectedItem.itemTotalValue = this.selectedItem.price && this.selectedItem.quantity ? this.selectedItem.price * this.selectedItem.quantity : 0;
    this.ItemsByLookup.forEach(item => {
      let itemChecked = this.orderItems.find(i => i.itemId == item.itemId);
      if (!itemChecked) {
        this.orderItems.push(item);
      } else {
        this.toaster.warning(item.itemNameAr + ' is already exist');
      }
    });
    this.modalService.dismissAll();

    this.emitSelectedProductsList();
  }

  GetSelectedItem(item: OrderDetailModel) {

    // let model: ItemModel = {} as ItemModel;
    this.selectedItem.itemId = item.itemId;
    this.selectedItem.itemNameAr = item.itemNameAr;
    this.selectedItem.itemNameEn = item.itemNameEn;
    this.selectedItem.unitId = item.unitId;
    this.selectedItem.unitNameAr = item.unitNameAr;
    this.selectedItem.unitNameEn = item.unitNameEn;
    this.selectedItem.unitId = item.unitId;
    this.selectedItem.price = item.price;
    this.selectedItem.quantity = 0;
    this.selectedItem.itemTotalValue = item.price && item.quantity ? item.price * item.quantity : 0;

    // this.selectedItem=model;
  }
  GetSelectedLookup(item: any) {
    const lookupId = item.itemLookupId;
    this.inventoryService.GetItemsByLookupId(lookupId).subscribe(data => {
      let Items: any[] = data;
      this.ItemsByLookup = Items;
      // this.ItemsByLookup = Items.map<PurchaseInvoiceDetails>(item => {
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
  }

  ChangeNewQuantity() {
    if (this.EditQuantityList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }
    this.EditQuantityList.forEach(item => {
      let Item = this.orderItems.find(i => i.itemId == item.itemId);
      Item.quantity = item.quantity;
      Item.itemTotalValue = item.price * item.quantity;
    });
    this.emitSelectedProductsList();
    this.modalService.dismissAll();
  }

  emitSelectedProductsList() {
    var list = this.orderItems.filter(x => x.quantity && x.quantity > 0);
    this.selectedProductsList.emit(list);
  }

  addField() {
    this.orderItems.push(
      {
        itemId: 0,
        itemNameAr: '',
        itemNameEn: '',
        unitId: 0,
        unitNameAr: '',
        unitNameEn: '',
        price: 0,
        quantity: 0,
        itemTotalValue: 0
      }
    );
  }
}
