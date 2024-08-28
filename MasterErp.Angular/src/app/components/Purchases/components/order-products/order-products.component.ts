import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { InventoryService } from '../../../Inventory/services/inventory.service';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ItemModel } from 'src/app/components/Inventory/models/Item';

@Component({
  selector: 'app-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.css']
})
export class OrderProductsComponent implements OnInit, OnChanges {
  @Input() selectedSupplierProducts: OrderDetailModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() showAddNew: boolean = true;
  @Output() selectedProductsList = new EventEmitter<OrderDetailModel[]>();
  showLoader: boolean = false;
  productsList: OrderDetailModel[] = [];
  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  LookupsList: any[] = [];
  ItemsList: ItemModel[] = [];
  ItemsByLookup: OrderDetailModel[] = [];
  ItemsBySupplier: any[] = [];
  EditQuantityList: OrderDetailModel[] = [];
  selectedItem: OrderDetailModel;
  activeTab = 'Item';
  notes: any;
  BranchId: any;
  SupplierId: any;
  LookupId: any;
  FilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25
  };


  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.AddSupplierProducts();
  }
  ngOnChanges(changes: any): void {
    if (changes && changes.selectedSupplierProducts) {
      this.AddSupplierProducts();
    }
    if (changes && changes.clearAllProducts && !changes.clearAllProducts?.firstChange) {
      this.productsList = [];
    }
  }
  AddSupplierProducts() {

    this.selectedSupplierProducts.forEach(item => {
      let checked = this.productsList?.find(i => i.itemId == item.itemId);
      if (!checked)
        this.productsList.push(item);
    });
    this.emitSelectedProductsList();
  }

  GetItemsData() {
    this.inventoryService.GetItemsData(this.FilterModel).subscribe(data => {
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
      if (this.selectedItem.itemId) {
        let checked = this.productsList.find(i => i.itemId == this.selectedItem.itemId);
        if (!checked)
          this.productsList.push(this.selectedItem);
        else
          this.toaster.warning(this.selectedItem.itemNameAr + ' Is Exist In Purchase Item List')
        this.modalService.dismissAll();
      }
      else
        this.toaster.warning('Please Select Item Or Lookups');
    } else {
      this.ItemsByLookup.forEach(item => {
        let itemChecked = this.productsList.find(i => i.itemId == item.itemId);
        if (!itemChecked) {
          this.productsList.push(item);
        } else {
          this.toaster.warning(item.itemNameAr + ' is already exist');
        }
      });
      this.modalService.dismissAll();
    }
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
      let Item = this.productsList.find(i => i.itemId == item.itemId);
      Item.quantity = item.quantity;
      Item.itemTotalValue = item.price * item.quantity;
    });
    this.emitSelectedProductsList();
    this.modalService.dismissAll();
  }
  emitSelectedProductsList() {
    var list = this.productsList.filter(x => x.quantity && x.quantity > 0);
    this.selectedProductsList.emit(list);
  }
}
