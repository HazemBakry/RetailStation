import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { FilterModel, SearchFilterModel } from '../../models/FilterModel';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { SharedService } from '../../services/shared.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { GeneralSelectorModel } from '../general-selector/general-selector.component';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit, OnChanges {
  @Input() selectedProducts: OrderProductModel[] = [];
  @Input() selectedSupplierProducts: OrderProductModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() showAddNew: boolean = true;
  @Output() selectedProductsList = new EventEmitter<OrderProductModel[]>();
  showLoader: boolean = false;
  ItemsList: any[] = [];
  supplierSelector: any[] = [];
  BranchesList: any[] = [];
  lookupSelector: any[] = [];
  orderItems: OrderProductModel[] = [];

  ItemsByLookup: OrderProductModel[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  EditQuantityList: OrderProductModel[] = [];
  selectedItem: OrderProductModel;
  // selectedItem: any={} ;
  notes: any;
  BranchId: any;
  SupplierId: any;
  selectedLookupId: any;
  //itemModel: ItemModel = {} as ItemModel;

  itemsSelector: GeneralSelectorModel[] = [];
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
    this.addSupplierProducts();
    this.loadSelector();
  }

  ngOnChanges(changes: any): void {
    if (changes && changes.selectedProducts && changes.selectedProducts?.currentValue?.length > 0) {
      this.addProducts();
    }
    if (changes && changes.selectedSupplierProducts) {
      this.addSupplierProducts();
    }

    if (changes && changes.clearAllProducts && !changes.clearAllProducts?.firstChange) {
      this.orderItems = [];
    }
  }

  loadSelector() {
    this.sharedService.GetItemsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.itemsSelector = data;
    });

    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.BranchesList = data;
    });

    this.sharedService.GetSuppliersSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.supplierSelector = data;
    });

    this.sharedService.GetItemLookupsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.lookupSelector = data;
    });
  }

  openItemsModal(content: any) {
    this.selectedItem = {} as OrderProductModel;
    // this.GetItemsData();
    // this.getItemsLookups();
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  // getItemsLookups() {
  //   this.inventoryService.GetItemsLookups().subscribe(data => {
  //     this.lookupSelector = data;
  //   });
  // }


  validateNumbers(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }

  addField() {
    var item: OrderProductModel = {
      itemId: null,
      itemNameAR: '',
      itemNameEN: '',
      unitId: null,
      unitNameAR: '',
      unitNameEN: '',
      price: null,
      quantity: null,
      totalValue: null,
      isActive: true
    }
    
    this.orderItems.push(item);
    this.emitSelectedProductsList();
  }
  removeItem(index: number) {
    this.orderItems.splice(index, 1);
    this.emitSelectedProductsList();
  }

  getItemDetailsById(itemId, index: number) {
    // let itemChecked = this.orderItems.find(i => i.itemId == itemId);
    // if (itemChecked) {
    //   this.toaster.warning(itemChecked.itemNameAR + ' is already exist');
    //   this.removeItem(index);
    //   return;
    // }
    var item = this.orderItems[index];
    this.inventoryService.GetItemDetailsById(itemId).subscribe((data: ItemModel) => {
      if (data) {
        item.itemId = data.itemId;
        item.itemNameAR = data.nameAR;
        item.itemNameEN = data.nameEN;
        item.unitId = data.unitId;
        item.unitNameAR = data.unitName;
        item.unitNameEN = data.unitName;
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
    this.emitSelectedProductsList();
  }

  addSupplierProducts() {
    this.selectedSupplierProducts.forEach(item => {
      let checked = this.orderItems?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.orderItems.push(item);
    });
    this.emitSelectedProductsList();
  }
  calcTotalValue() {
    this.orderItems.forEach(item => {
      item.totalValue = item.price * item.quantity;
    });
    this.emitSelectedProductsList();
  }
  addProducts() {    
    this.selectedProducts.forEach(item => {
      let checked = this.orderItems?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.orderItems.push(item);
      // else
      // {
      //   checked.price += item.price;
      //   checked.totalValue += item.totalValue;
      //   checked.quantity+= item.quantity;

      // }
    });
    if(this.orderItems)
     this.emitSelectedProductsList();
  }
  saveSelectedLookup() {
    // this.selectedItem.itemTotalValue = this.selectedItem.price && this.selectedItem.quantity ? this.selectedItem.price * this.selectedItem.quantity : 0;
    // this.ItemsByLookup.forEach(item => {
    //   let itemChecked = this.orderItems.find(i => i.itemId == item.itemId);
    //   if (!itemChecked) {
    //     this.orderItems.push(item);
    //   } else {
    //     this.toaster.warning(item.itemNameAr + ' is already exist');
    //   }
    // });
    // this.modalService.dismissAll();

    this.emitSelectedProductsList();
  }

  selectedLookupChanged(lookupId: number) {
    this.selectedLookupId = lookupId;
  }
  getSelectedLookup() {

    if (!this.selectedLookupId)
      return;

    this.orderItems = [];
    this.inventoryService.GetItemsByLookupId(this.selectedLookupId).subscribe((data: OrderProductModel[]) => {
      this.orderItems = data.map<OrderProductModel>(item => {
        return{
          itemId: item.itemId,
          itemNameAR: item.itemNameAR,
          itemNameEN: item.itemNameEN,
          unitId: item.unitId,
          unitNameAR: item.unitNameAR,
          unitNameEN: item.unitNameAR,
          price: item.price,
          quantity: item.quantity,
          totalValue: item.price * item.quantity,
          isActive: true
        }
      });

      
    });
    this.modalService.dismissAll();

    this.emitSelectedProductsList();
  }

  emitSelectedProductsList() {
    var list = this.orderItems.filter(x => x.itemId && x.quantity && x.quantity > 0);
    this.selectedProductsList.emit(list);
  }


}
