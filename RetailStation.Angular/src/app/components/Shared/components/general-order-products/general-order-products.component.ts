import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { SearchFilterModel } from '../../models/FilterModel';
import { FormDropdownModel } from '../drop-down-form-control/drop-down-form-control.component';
import { SharedService } from '../../services/shared.service';

import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { ItemModel } from '../../models/ItemModel';

@Component({
  selector: 'app-general-order-products',
  templateUrl: './general-order-products.component.html',
  styleUrls: ['./general-order-products.component.css']
})
export class GeneralOrderProductsComponent implements OnInit, OnChanges {
  @Input() selectedProducts: GeneralOrderDetailsModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() showAddNew: boolean = true;
  @Input() showEditQuantity : boolean = true;
  @Input() disablePrice : boolean = true;
  @Input() disableUnit : boolean = true;
  @Output() selectedProductsList = new EventEmitter<GeneralOrderDetailsModel[]>();


  showLoader: boolean = false;
  productsList: GeneralOrderDetailsModel[] = [];
  itemsLookupsSelectorData: FormDropdownModel[] = [];
  itemsSelectorData: FormDropdownModel[] = [];
  unitsSelectorData: FormDropdownModel[] = [];

  itemsList: any[] = [];
  itemsByLookup: GeneralOrderDetailsModel[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  editQuantityList: GeneralOrderDetailsModel[] = [];
  selectedItem: GeneralOrderDetailsModel;
  originalItem: ItemModel;
  // selectedItem: any={} ;
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10
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
    if (changes && changes.selectedProducts && changes.selectedProducts?.currentValue?.length > 0) {
      this.addProducts();
    }
    if (changes && changes.clearAllProducts !=null && !changes.clearAllProducts?.firstChange) {
      this.productsList = [];
    }
  }
  addProducts() {    
    this.selectedProducts.forEach(item => {
      let checked = this.productsList?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.productsList.push(item);
      // else
      // {
      //   checked.price += item.price;
      //   checked.totalValue += item.totalValue;
      //   checked.quantity+= item.quantity;

      // }
    });
    if(this.productsList)
     this.emitSelectedProductsList();
  }

  openItemsModal(content: any) {
    this.selectedItem = {} as GeneralOrderDetailsModel;
    this.originalItem = {} as ItemModel;
    this.loadSelectors()
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  loadSelectors()
  {
    this.sharedService.GetItemLookupsSelector().subscribe(data => {
      this.itemsLookupsSelectorData = data;
    });
    this.loadItemsSelector();
    this.sharedService.GetUnitsSelector().subscribe((data: FormDropdownModel[]) => {
      this.unitsSelectorData = data;
    });
  }

  loadItemsSelector()
  {
    this.sharedService.GetItemsSelector().subscribe(data => {
      this.itemsSelectorData = data;
    });
  }
  openEditQuantityModal(content: any) {
    if (this.productsList.length == 0) {
      this.toaster.warning('لا يوجد اصناف');
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
        {
          checked.quantity += this.selectedItem.quantity ?? 0 ;
          checked.totalValue += this.selectedItem.totalValue ?? 0 ;
          // this.toaster.warning(this.selectedItem.itemNameAR + ' Is Exist In Purchase Item List')
        }
        this.modalService.dismissAll();
        if (this.selectedItem.price != this.originalItem.cost ||this.selectedItem.unitId != this.originalItem.unitId) {
          // this.changeItemPrice(this.selectedItem.itemId, this.selectedItem.price);
          if (this.selectedItem.unitId != this.originalItem.unitId) {
            var newUnit = this.unitsSelectorData.find(u => u.value == this.selectedItem.unitId);
            if (newUnit != null) 
            {
              this.selectedItem.unitNameAR = newUnit.name;
              this.selectedItem.unitNameEN = newUnit.name;
            }  
          }
          this.originalItem.unitId = this.selectedItem.unitId;
          this.originalItem.cost = this.selectedItem.price;
          this.itemQuickUpdate(this.selectedItem.itemId, this.selectedItem.price,this.selectedItem.unitId);
        }
        
      }
      else
        this.toaster.warning('Please Select Item Or Lookups');
    } else {
      this.itemsByLookup.forEach(item => {
        let itemChecked = this.productsList.find(i => i.itemId == item.itemId);
        if (!itemChecked) {
          this.productsList.push(item);
        } else {
          itemChecked.quantity += item.quantity ?? 0 ;
          itemChecked.totalValue += item.totalValue ?? 0 ;

          // this.toaster.warning(item.itemNameAR + ' is already exist');
        }
      });
      this.modalService.dismissAll();
    }
    this.emitSelectedProductsList();
  }
  getSelectedItem(itemId) {

    this.inventoryService.GetItemDetailsById(itemId).subscribe((data:ItemModel) => {
      this.originalItem = {...data};
      let item: ItemModel = data;
      this.selectedItem.itemId = item.itemId;
      this.selectedItem.itemNameAR = item.nameAR;
      this.selectedItem.itemNameEN = item.nameEN;
      this.selectedItem.unitId = item.unitId;
      this.selectedItem.unitNameAR = item.unitName;
      this.selectedItem.unitNameEN= item.unitName;
      this.selectedItem.price = item.cost;
      this.selectedItem.quantity = 0;
      // this.selectedItem.totalValue = item.cost && item.quantity ? item.cost * item.quantity : 0;    
    });

  }
  getSelectedLookup(lookupId: any) {
    this.inventoryService.GetItemsByLookupId(lookupId).subscribe(data => {
      let Items: any[] = data;
      this.itemsByLookup = Items;
    });
  }
  changeNewQuantity() {
    if (this.editQuantityList.length == 0) {
      this.toaster.warning('لا يوجد اصناف');
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

  itemQuickUpdate(ItemId: number,Price: number,unitId: number) {
    this.inventoryService.ItemQuickUpdate(ItemId,Price,unitId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
      //this.showAddLoader = false;
    }, err => {
      //this.showAddLoader = false;
    }, () => {
      //this.showAddLoader = false;
    });
  }

}

