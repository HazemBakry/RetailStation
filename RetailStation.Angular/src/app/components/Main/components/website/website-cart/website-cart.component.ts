import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PagedResponseDTO, PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { MaterialReceiptModel } from 'src/app/components/Inventory/models/MaterialReceiptModel';
import { WebsiteService } from 'src/app/components/Main/services/website.service';
import { SupplierItemModel } from 'src/app/components/Main/models/SupplierItemModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { CartModel, CartService } from 'src/app/components/Shared/services/cart.service';

@Component({
  selector: 'app-website-cart',
  templateUrl: './website-cart.component.html',
  styleUrls: ['./website-cart.component.css']
})
export class WebsiteCartComponent implements OnInit {
  TitleList = ['انشاء طلبية'];
  OrdersList: any[] = [];
  showLoader: boolean;

  selectAll: boolean = false;
  orderNumber: string = '';
  orderDate: string;
  cartList: CartModel[] = [];
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersSelectorData: GeneralSelectorModel[] = [];
  compareCount$: number = 0;

  constructor(private offcanvasService: NgbOffcanvas,
    private sharedService: SharedService,
    private cartService: CartService,
    private modalService: NgbModal,
    private toaster: ToastrService, private websiteService: WebsiteService,
  ) { }


  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    this.mapFilters();
    if (this.pageResponseModel.filterList.length == 0) {
      this.toaster.warning('لا يوجد أصناف ');
      return;
    }

    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      // this.suppliersData = this.suppliersData.concat([...data.results]);
      this.pageResponseModel.totalCount = data.totalCount;

      this.setQuantity();

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.loadData();
  }
  mapFilters() {
    this.cartList = this.cartService.getCurrentCartItems();
    this.pageResponseModel.pageSize = this.cartList.length;
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    this.cartList.forEach(item => {
      if (item.supplierItemId) {
        this.pageResponseModel.filterList.push({ categoryName: 'SupplierItemId', itemFlag: item.supplierItemId.toString() })
      }
    });
  }
  setQuantity() {
    this.cartList.forEach(item => {
      const found = this.pageResponseModel.results.find(i => i.supplierItemId === item.supplierItemId);
      if (found) {
        found.quantity = item.quantity;
        found.cost = item.quantity * found.price;
      }
    });
  }
  remove(item: SupplierItemModel): void {
    this.cartService.removeItem(item.supplierItemId);
    this.loadData();
  }

  onQuantityChange(item: SupplierItemModel, newQuantity: number): void {
    item.quantity = newQuantity;
    item.cost = newQuantity * item.price;
    this.cartService.changeItemQuantity(item.supplierItemId, newQuantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    this.pageResponseModel.totalCount = 0;
    this.cartList = [];
    this.toaster.success('Cart has been cleared.');
  }









  openSaveModal(content: any) {
    if (this.pageResponseModel.results.length == 0) {
      this.toaster.warning('لا يوجد أصناف ');
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }


  createOrder() {
    console.log("🚀 ~ WebsiteCartComponent ~ createOrder ~ this.pageResponseModel.results:", this.pageResponseModel.results)
  }
}


