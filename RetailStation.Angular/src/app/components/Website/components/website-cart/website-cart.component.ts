import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { CartModel, CartService } from 'src/app/components/Shared/services/cart.service';
import { CreateOrderItemModel, CreateOrderModel } from '../../models/WebsiteOrderModel ';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebsiteService } from '../../services/website.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Auth/auth.service';
import { TotalValuePromotionModel } from 'src/app/components/Admin/models/TotalValuePromotion';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-website-cart',
  templateUrl: './website-cart.component.html',
  styleUrls: ['./website-cart.component.scss']
})
export class WebsiteCartComponent implements OnInit {
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  showLoader: boolean=false;
  showCreateOrderLoader: boolean=false;
  orderNumber: string = '';
  orderDate: string;
  cartList: CartModel[] = [];
  totalValue = 0.0;
  tax = 0.0;
  discount = 0.0;
  netValue = 0.0;
  taxRate = 0.15;
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  cartItems: MerchantItemModel[] = [];
  compareCount$: number = 0;
  isAuthenticated: boolean = false;
  activePromotion: TotalValuePromotionModel;
  countriesSelectorData: GeneralSelectorModel[] = [];
  paymentMethodsSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  shippingData = {
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    countryId: null,
    city: '',
    cityId: null,
    fullAddress: '',
    notes: ''
  };

  // Step 3 Data model
  paymentData = {
    paymentMethodId: 1,
    paymentMethod: '',
    shippingCost: 0.0
  };

  constructor(private offcanvasService: NgbOffcanvas,
    private sharedService: SharedService,
    private router: Router,
    private cartService: CartService,
    private modalService: NgbModal,
    private authService: AuthService,
    // private toaster: ToastrService, 
    private websiteService: WebsiteService,
    private lookupService: LookupService,
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }


  ngOnInit(): void {
    this.loadSelectors();
    this.loadCartPromotion();
    this.getCurrentCartItems();
    this.loadData();
  }


  loadData() {
    this.mapFilters();
    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      this.cartItems = this.pageResponseModel.results;
      // this.merchantsData = this.merchantsData.concat([...data.results]);
      //this.pageResponseModel.totalCount = data.totalCount;

      this.setQuantity();
      this.calculateCartSummary();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getCurrentCartItems() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartList = items;
    });
  }
  mapFilters() {
    // this.cartList = this.cartService.getCurrentCartItems();
    this.pageResponseModel.pageSize = this.cartList.length;
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    this.cartList.forEach(item => {
      if (item.merchantItemId) {
        this.pageResponseModel.filterList.push({ categoryName: 'merchantItemId', itemFlag: item.merchantItemId.toString() })
      }
    });
  }
  loadCartPromotion() {
    this.websiteService
      .GetWebsiteTotalValuePromotions(this.pageResponseModel)
      .subscribe(
        (data) => {
          this.activePromotion = data.results.length > 0 ? data.results[0] : null;

          this.calculateCartSummary();
        },
        (err) => {
        },
        () => {
        }
      );
  }
  setQuantity() {
    this.cartList.forEach(item => {
      const found = this.pageResponseModel.results.find(i => i.merchantItemId === item.merchantItemId);
      if (found) {
        found.quantity = item.quantity;
        found.cost = item.quantity * (found.price);
      }
    });
    this.updateTotalCost();
    this.calculateCartSummary();
  }

  // remove(item: MerchantItemModel): void {
  //   this.cartService.removeItem(item.merchantItemId);
  //   this.loadData();
  // }

  changeQuantity_New(item: MerchantItemModel, newQuantity: number): void {
    var minimumOrderQuantity = item.minimumOrderQuantity ?? 1;
    if (newQuantity > 0 && newQuantity >= minimumOrderQuantity) {
      item.quantity = newQuantity;
      this.cartService.changeItemQuantity(item.merchantItemId, newQuantity);
    } else {
      item.quantity = minimumOrderQuantity;
      this.cartService.changeItemQuantity(item.merchantItemId, minimumOrderQuantity);
    }
    this.setQuantity();
  }
  changeQuantity(item: MerchantItemModel, newQuantity: number): void {
    debugger
    if (item.quantity + newQuantity > 0) {
      // this.itemQuantity = this.itemQuantity + qty;
      this.cartService.changeItemQuantity(item.merchantItemId, item.quantity + newQuantity);
      this.setQuantity();
    }
  }

  removeItem(item: any) {
    debugger
    this.cartService.removeItem(item.merchantItemId);
    this.loadData();
  }

  calculateCartSummary() {
    this.totalValue = 0.0;
    this.tax = 0.0;
    this.discount = 0.0;
    this.netValue = 0.0;
    let discountPercent = 0;

    this.cartItems.forEach((item) => {
      let itemTotal = (item.price ?? 0) * (item.quantity);
      this.netValue += itemTotal;
    });
    if (this.activePromotion && this.netValue >= this.activePromotion.minValue) {

      if (this.activePromotion.isPercentage) {
        this.discount = this.netValue * (this.activePromotion.discountValue / 100);
        this.netValue = this.netValue - this.discount;
      }
      else {
        this.discount = this.activePromotion.discountValue;
        this.netValue = this.netValue - this.discount;
      }
    }

    this.totalValue = (this.netValue * (1 + this.taxRate));
    this.tax = this.totalValue - this.netValue;
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    this.pageResponseModel.totalCount = 0;
    this.cartList = [];
    //this.toaster.success('Cart has been cleared.');
  }
  totalCost: number = 0
  withoutVatTotal: number = 0
  vatAmount: number = 0
  updateTotalCost(): void {
    this.withoutVatTotal = parseFloat(this.pageResponseModel.results.reduce((sum, item) => sum + ((item.cost ?? 0)), 0).toFixed(2));
    this.totalCost = parseFloat((this.totalCost * (1 + this.taxRate)).toFixed(2));
    this.vatAmount = parseFloat((this.totalCost - this.withoutVatTotal).toFixed(2));
    // this.totalCost = parseFloat(this.pageResponseModel.results.reduce((sum, item) => sum + ((item.cost ?? 0)), 0).toFixed(2));
    // this.withoutVatTotal = parseFloat((this.totalCost /(1+this.taxRate)).toFixed(2));
    // this.vatAmount = parseFloat((this.totalCost - this.withoutVatTotal).toFixed(2));
  }

  // openSaveModal(content: any) {
  //   if (this.pageResponseModel.results.length == 0) {
  //     this.toaster.warning('لا يوجد أصناف ');
  //     return;
  //   }
  //   this.modalService.open(content, { centered: true, size: 'md' });
  // }


  orderModel: CreateOrderModel = {} as CreateOrderModel;
  orderItems: CreateOrderItemModel[] = [];

  createOrder() {
    this.orderItems = [];
    this.orderModel = {} as CreateOrderModel;

    if (this.cartItems.length == 0 || !this.cartItems.some(i => i.quantity)) {
      this.alertConfirmation('Please Add Items with Quantity', 'Warning', 0);
      return;
    }
    this.cartItems = this.cartItems.filter(i => i.quantity);

    this.cartItems.forEach(item => {
      let OrderItem: CreateOrderItemModel = {} as CreateOrderItemModel;
      OrderItem.itemId = item.itemId;
      OrderItem.merchantItemId = item.merchantItemId;
      OrderItem.merchantId = item.merchantId;
      OrderItem.price = item.price;
      OrderItem.quantity = item.quantity;
      OrderItem.subTotal = 0;
      OrderItem.discount = 0;
      OrderItem.discountPercent = 0;
      OrderItem.unitId = item.unitId;
      OrderItem.totalValue = item.price * item.quantity;
      OrderItem.notes = '';
      this.orderItems.push(OrderItem);
    });

    this.orderModel.discount = 0;
    this.orderModel.notes = '';
    this.orderModel.deliveryValue = 0;
    this.orderModel.subTotal = 0;
    this.orderModel.tax = this.tax ?? 0;
    //this.orderModel.totalValue = this.orderItems.reduce((sum, item) => (sum + item.totalValue), 0);
    //this.orderModel.netValue = this.orderModel.totalValue - (this.orderModel.discount ?? 0) + (this.orderModel.tax ?? 0) + (this.orderModel.deliveryValue ?? 0);
    this.orderModel.totalValue = this.totalValue;
    this.orderModel.netValue = this.netValue;
    this.orderModel.paymentTypeId = 1;
    this.orderModel.items = this.orderItems;
    this.setSelectorsNames(); // to fill shipping and payment data
    this.showCreateOrderLoader = true;
    this.websiteService.CreateNewOrder(this.orderModel).subscribe(response => {

      if (response.isSuccess) {
        //this.toaster.success(response.message);
        this.clearCart();
        this.cartItems = [];
        this.orderModel = {} as CreateOrderModel;
        this.alertConfirmation('تم تاكيد الطلب بنجاح', 'Success', response?.number);
      }
      else {
        this.alertConfirmation('حدث خطأ عند تاكيد الطلب', 'Error', -1);
        //this.toaster.error(response.message);
      }
      this.modalService?.dismissAll();
      this.showCreateOrderLoader = false;
    }, (error) => {
      this.showCreateOrderLoader = false;
    }, () => {
      this.showCreateOrderLoader = false;
    });
  }


  alertConfirmation(message: string, alterType: any, orderNumber: number) {
    Swal.fire({
      // title: 'تم تاكيد الطلب بنجاح',
      title: message,
      html: alterType == 'Success' ? ' رقم الطلب: ' + orderNumber : '',
      icon: alterType == 'Success' ? 'success' : 'error',
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'موافق',
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/');
      }
    });
  }
  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
    this.paymentMethodsSelectorData = this.sharedService.paymentMethodsSelectorData;

    // this.lookupService.GetPaymentMethods().subscribe((data: GeneralSelectorModel[]) => {
    //   this.paymentMethodsSelectorData = data;
    // });
  }
  onCountryChange(value) {
    this.citiesSelectorData = [];
    this.shippingData.cityId = null;
    if (value)
      this.loadCitiesByCountryId(value);
  }
  loadCitiesByCountryId(countryId: number) {
    this.sharedService.GetCitiesSelector(countryId).subscribe((data: GeneralSelectorModel[]) => {
      this.citiesSelectorData = data;
    });
  }


  ////////////////////////// stepper
  currentStep: number = 1;

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  setSelectorsNames() {
    if (this.shippingData?.countryId) {
      this.shippingData.country = this.countriesSelectorData.find(c => c.value == this.shippingData.countryId)?.name;
    }
    if (this.shippingData?.cityId) {
      this.shippingData.city = this.citiesSelectorData.find(c => c.value == this.shippingData.cityId)?.name;
    }
    if (this.paymentData?.paymentMethodId) {
      this.paymentData.paymentMethod = this.paymentMethodsSelectorData.find(c => c.value == this.paymentData.paymentMethodId)?.name;
    }
    this.orderModel.cityId = this.shippingData.cityId;
    this.orderModel.countryId = this.shippingData.countryId;
    this.orderModel.fullAddress = this.shippingData.fullAddress;
    this.orderModel.receiverName = this.shippingData.fullName;
    this.orderModel.notes = this.shippingData.notes;
    this.orderModel.paymentTypeId = this.paymentData.paymentMethodId;
    this.orderModel.phoneNumber = this.shippingData.phoneNumber;
  }
}


