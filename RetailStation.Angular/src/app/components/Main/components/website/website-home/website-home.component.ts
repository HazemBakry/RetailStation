import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WebsiteService } from '../../../services/website.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../../../models/SupplierItemModel';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-website-home',
  templateUrl: './website-home.component.html',
  styleUrls: ['./website-home.component.css']
})
export class WebsiteHomeComponent implements OnInit {
  systemURL: string = environment.systemUrl;

  moreFilters = false;
  SubscribersData: any[] = [];
  PromotionItems: any[] = [];
  images: any[] = [];
  kitchenCategories: any[] = [];
  CartItemsList: any[] = [];
  FoodItem: any;
  UserModelStr: any;
  UserModel: any;
  activeOrderFilter: number;
  activeSectionsFilter: number;
  counterValue = 1;
  TotalValue = 0;
  NetValue = 0;
  DeliveryFees = 5;
  countRange = 7;
  count = 1 * this.countRange;

  mostPopular = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];

  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersData: SupplierItemModel[] = [];
  constructor(config: NgbCarouselConfig, private websiteService: WebsiteService,
    private sharedService: SharedService, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, private toaster: ToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private menuService: MenuService) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.GeneralAccountsHome, this.selectedTabName);
      }
    });
  }


  ngOnInit(): void {
    // this.UserModelStr = localStorage.getItem('UserModel');
    // this.UserModel = JSON.parse(this.UserModelStr);
    // if (this.sharedService.CartList.length > 0) {
    //   this.CartItemsList = this.sharedService.CartList;
    // }
    this.GetSlidersImages();
    this.GetPromotionItems();
    this.GetSubscribersByFoodType(0);
    this.GetFoodTypes();

  }
  GetFoodTypes() {
    // this.websiteService.GetFoodTypes().subscribe(data => {
    //   this.kitchenCategories = data;
    // });
  }

  GetSubscribersByFoodType(foodTypeId: any) {
    // this.websiteService.GetSubscribersByFoodType(foodTypeId).subscribe(data => {
    //   this.SubscribersData = data;
    //   this.SubscribersData.map(item => {
    //     item.image = item.image.split(',');
    //   });
    // });
  }

  GetPromotionItems() {
    // this.websiteService.GetPromotionItems().subscribe(data => {
    //   this.PromotionItems = data;
    //   this.PromotionItems.map(item => {
    //     if (item.discount != 0 || item.discount != null) {
    //       item.totalValue = item.price2 - item.discount;
    //     } else {
    //       item.totalValue = item.price2;
    //     }
    //     item.counterValue = 1;
    //   });
    // });
  }

  GetSlidersImages() {
    // this.websiteService.GetSlidersImages().subscribe(data => {
    //   this.images = data;
    // });
  }

  onFoodTypeChange(foodTypeId: any) {
    this.GetSubscribersByFoodType(foodTypeId);

  }

  moreAndLessFilterBtn() {
    this.moreFilters = !this.moreFilters;
    this.moreFilters ? this.count = this.count * this.kitchenCategories.length : this.count = this.countRange;
  }

  SaveMyCart(itemId: number, quantity: number, userId: number, notes: string) {
    // this.websiteService.SaveMyCart(itemId, quantity, userId, notes).subscribe(data => {
    //   if (data) {
    //     this.toaster.success('Item Added Successfully');
    //   } else {
    //     this.toaster.success('Item Added Failure');
    //   }
    // });
  }

  counter(type: string, Item: any) {
    type === 'plus' ? this.counterValue++ : this.counterValue--;
  }

  openModal(content: any, FoodItem: any) {
    debugger;
    this.FoodItem = FoodItem;
    this.counterValue = 1;
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' })
  }

  openSidePanel(content: any, CartItem: any) {
    // this.TotalValue = 0;
    // if (CartItem) {
    //   let checkCartItem = this.CartItemsList.find(a => a.foodItemId == CartItem.foodItemId);
    //   this.CartItemsList = this.CartItemsList.filter(a => a.foodItemId != CartItem.foodItemId);
    //   if (checkCartItem) {
    //     CartItem.counterValue = this.counterValue;
    //     if (CartItem.discount != 0 || CartItem.discount != null) {
    //       CartItem.totalValue = (CartItem.price2 - CartItem.discount) * this.counterValue;
    //     } else {
    //       CartItem.totalValue = CartItem.price2 * this.counterValue;
    //     }
    //     this.CartItemsList.unshift(CartItem);
    //     this.CartItemsList.map(item => {
    //       this.TotalValue += item.totalValue;
    //     });
    //   } else {
    //     if (CartItem.discount != 0 || CartItem.discount != null) {
    //       CartItem.totalValue = (CartItem.price2 - CartItem.discount) * this.counterValue;
    //     } else {
    //       CartItem.totalValue = CartItem.price2 * this.counterValue;
    //     }
    //     CartItem.counterValue = this.counterValue;

    //     this.CartItemsList.push(CartItem);
    //     this.CartItemsList.map(item => {
    //       this.TotalValue += item.totalValue;
    //     });
    //   }
    //   this.NetValue = this.TotalValue + this.DeliveryFees;
    //   if (this.UserModel && this.UserModel != null) {
    //     this.SaveMyCart(CartItem.foodItemId, this.counterValue, Number(this.UserModel.userID), '');
    //   }
    //   this.sharedService.AddToCartList(CartItem);
    //   this.sharedService.ChangeCartNumber(this.CartItemsList);
    //   this.offcanvasService.open(content, { scroll: true })

    // }
  }

}
