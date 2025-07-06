import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { FilterModel, SearchFilterModel } from '../../models/FilterModel';
import { SharedService } from '../../services/shared.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { GeneralSelectorModel } from '../general-selector/general-selector.component';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit, OnChanges {
  @Input() selectedProducts: GeneralOrderDetailsModel[] = [];
  @Input() selectedSupplierProducts: GeneralOrderDetailsModel[] = [];
  @Input() clearAllProducts: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showAddNew: boolean = true;
  @Input() showRequestedQuantity: boolean = false;
  @Input() showPrice: boolean = true;
  @Input() showDueDate: boolean = false;
  @Input() dueDate: string = null;
  @Input() showExpireDate: boolean = false;
  @Input() showActions: boolean = true;
  @Input() disableSupplierSelector: boolean = false;
  @Input() disablePrice: boolean = true;
  @Input() selectedSupplierId: number;
  @Output() selectedProductsList = new EventEmitter<GeneralOrderDetailsModel[]>();
  showLoader: boolean = false;
  ItemsList: any[] = [];
  supplierSelector: any[] = [];
  BranchesList: any[] = [];
  lookupSelector: any[] = [];
  orderItems: GeneralOrderDetailsModel[] = [];

  ItemsByLookup: GeneralOrderDetailsModel[] = [];
  ItemsBySupplier: any[] = [];
  // RawItemsList: any[] = [];
  EditQuantityList: GeneralOrderDetailsModel[] = [];
  selectedItem: GeneralOrderDetailsModel;
  // selectedItem: any={} ;
  notes: any;
  BranchId: any;
  SupplierId: any;
  selectedLookupId: any;
  //itemModel: ItemModel = {} as ItemModel;

  itemsSelector: GeneralSelectorModel[] = [];
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10
  };
  today: string;
  constructor(private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private toaster: ToastrService) { 
      this.today = this.datePipe.transform(new Date, 'yyyy-MM-dd');
    }

  ngOnInit(): void {
    this.addProducts();
    this.addSupplierProducts();
    this.loadSelector();
  }

  ngOnChanges(changes: any): void {
    if (changes && changes.selectedProducts && changes.selectedProducts?.currentValue?.length > 0) {
      this.addProducts();
    }
    if (changes && changes.dueDate) {
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
    this.selectedItem = {} as GeneralOrderDetailsModel;
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
  checkQuantityValue(event: Event, item: GeneralOrderDetailsModel) {
    var value = +(event.target as HTMLInputElement).value;
    if (this.showRequestedQuantity && value && value > item.requestedQuantity) {
      this.toaster.warning('الكمية المطلوبة اكبر من الكمية المدخلة');
      item.quantity = item.requestedQuantity;
    }
    this.calcTotalValue();
  }
  addField() {
    var item: GeneralOrderDetailsModel = {
      itemId: null,
      itemNameAR: '',
      itemNameEN: '',
      unitId: null,
      unitNameAR: '',
      unitNameEN: '',
      price: 0,
      quantity: null,
      totalValue: null,
      dueDate: this.getDueDate(),
      expireDate: this.today,
      // isActive: true
    }

    this.orderItems.push(item);
    this.emitSelectedProductsList();
  }
  removeItem(index: number = null) {
    if (index) {
      this.orderItems.splice(index, 1);
    } else {
      this.orderItems = [];
      this.selectedLookupId = null;
      this.selectedSupplierId = null;
    }
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
        item.price = data.cost;
        item.quantity = 0;
        item.totalValue = 0;
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
    debugger
    if (this.showExpireDate&&this.today) {
      // this.orderItems = this.orderItems.map(item=>({...item,expireDate:this.today}));
      this.orderItems.forEach(item=>{item.expireDate=this.today});
    }
    
    if (this.showDueDate&&this.dueDate) {
            this.orderItems.forEach(item=>{item.dueDate=this.getDueDate()});

      //this.orderItems = this.orderItems.map(item=>({...item,dueDate:this.getDueDate()}));
    }
    if (this.orderItems)
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
    this.inventoryService.GetItemsByLookupId(this.selectedLookupId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderItems = data.map<GeneralOrderDetailsModel>(item => {
        return {
          itemId: item.itemId,
          itemNameAR: item.itemNameAR,
          itemNameEN: item.itemNameEN,
          unitId: item.unitId,
          unitNameAR: item.unitNameAR,
          unitNameEN: item.unitNameAR,
          price: item.price,
          quantity: item.quantity,
          totalValue: item.price * item.quantity,
          isActive: true,
          dueDate:this.getDueDate()
        }
      });


    });
    this.modalService.dismissAll();

    this.emitSelectedProductsList();
  }

  selectedSupplierChanged(supplierId: number) {
    this.selectedSupplierId = supplierId;
  }
  getSelectedSupplierItems() {

    this.orderItems = [];

    if (!this.selectedSupplierId) {
      this.toaster.warning('يجب الاختيار من الموردين')
      return;
    }

    this.inventoryService.GetItemsBySupplierId(this.selectedSupplierId).subscribe(data => {
      if (data && data.length > 0) {
        this.orderItems = data.map<GeneralOrderDetailsModel>(item => {
          return {
            itemId: item.itemId,
            itemNameAR: item.nameAR,
            itemNameEN: item.nameEN,
            unitId: item.unitId,
            unitNameAR: item.unitName,
            unitNameEN: item.unitName,
            price: item.cost,
            quantity: 0,
            totalValue: 0,
            isActive: true,
            dueDate :this.getDueDate()
          }
        });
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });

    this.modalService.dismissAll();

    this.emitSelectedProductsList();
  }

  itemQuickUpdate(ItemId: number, Price: number, unitId: number) {
    if (!Price || !unitId || !ItemId) {
      this.toaster.warning('يجب اختيار سع و وحدة صالحين');
    }
    this.inventoryService.ItemQuickUpdate(ItemId, Price, unitId).subscribe(data => {
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
  emitSelectedProductsList() {
    var list = this.orderItems.filter(x => x.itemId && x.quantity && x.quantity > 0);
    this.selectedProductsList.emit(list);
  }

  getDueDate()
  {
    return this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')
  }
}
