import { Component, OnInit } from '@angular/core';
import {
  NgbCarouselConfig,
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import {
  MenuService,
  MenuType,
} from 'src/app/components/Shared/services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';
import { SupplierItemModel } from 'src/app/components/Shared/models/SupplierItemModel';
import { ItemCategoryModel } from 'src/app/components/Shared/models/ItemCategory';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';

export interface RetailStationLogos {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-website-home',
  templateUrl: './website-home.component.html',
  styleUrls: ['./website-home.component.css'],
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
  CategoriesList: ItemCategoryModel[] = [];
  filterList: FilterModel[] = [];

  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 12,
    currentPage: 1,
    searchText: '',
  };
  //ItemsList: SupplierItemModel[] = [];

  constructor(
    config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe((params) => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(
          MenuType.GeneralAccountsHome,
          this.selectedTabName
        );
      }
    });
  }

  ngOnInit(): void {
    // this.UserModelStr = localStorage.getItem('UserModel');
    // this.UserModel = JSON.parse(this.UserModelStr);
    // if (this.sharedService.CartList.length > 0) {
    //   this.CartItemsList = this.sharedService.CartList;
    // }
    this.getSearchQuery();
    this.GetSlidersImages();
    this.GetPromotionItems();
    this.GetSubscribersByFoodType(0);
    this.GetFoodTypes();
    this.getWebsiteHomeCategories();
    this.loadFilters();
    this.getTopPartners();
  }
  getSearchQuery() {
    let itemCategoryId: string = '';
    this.route.queryParamMap.subscribe(params => {
      itemCategoryId = params.get('catId') || '';
      if(itemCategoryId){
        this.activeCategoryId = Number(itemCategoryId);
        this.activeCategoryName = this.CategoriesList.find(c=>c.itemCategoryId==this.activeCategoryId)?.nameAR;
      }
    });
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

  getWebsiteHomeCategories() {
    this.showLoader = true;
    this.websiteService.GetWebsiteHomeCategories().subscribe(
      (data: PagedResponseModel<ItemCategoryModel[]>) => {
        this.CategoriesList = data.results;
        //this.responseModel.totalCount = data.totalCount;
        this.showLoader = false;
      },
      (err) => {
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
      }
    );
  }

  activeCategoryId = null;
  activeCategoryName = null;
  onActiveItem(index: number) {
    this.activeCategoryId = this.CategoriesList[index].itemCategoryId;
    this.activeCategoryName = this.CategoriesList[index].nameAR;
    // this.getItemsByCategoryId();
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
    this.moreFilters
      ? (this.count = this.count * this.kitchenCategories.length)
      : (this.count = this.countRange);
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
    this.modalService.open(content, {
      centered: true,
      scrollable: true,
      size: 'lg',
    });
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

  getItemsByCategoryId() {
    this.showLoader = true;
    this.websiteService.GetItemsByCategoryId(this.activeCategoryId, this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data?.results;
      this.pageResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  loadFilters() {
    // this.showLoader = true;
    this.websiteService.GetWebsiteItems_Filters(this.pageResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pageResponseModel.filterList = filterItems;
    // this.pageResponseModel.filterList.push(this.mainFilter);
    this.pageResponseModel.results = [];
    this.getItemsByCategoryId();
  }

  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.getItemsByCategoryId();
  }

  retailStationLogos: RetailStationLogos[] = [
    {
      name: 'Shell',
      logo: 'https://1000logos.net/wp-content/uploads/2024/08/Shell-Logo.png',
    },
    {
      name: 'TotalEnergies',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/54/TotalEnergies_logo.svg/1200px-TotalEnergies_logo.svg.png',
    },
    {
      name: 'ExxonMobil',
      logo: 'https://download.logo.wine/logo/ExxonMobil/ExxonMobil-Logo.wine.png',
    },
    {
      name: 'BP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Bp_logo1961.png',
    },
    {
      name: 'Caltex',
      logo: 'https://images.seeklogo.com/logo-png/2/2/caltex-logo-png_seeklogo-25055.png',
    },
    {
      name: 'Esso',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Esso-Logo.svg/1200px-Esso-Logo.svg.png',
    },
    {
      name: 'Emarat',
      logo: 'https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png',
    },
    {
      name: 'ENOC',
      logo: 'https://autostarcompany.com/en/assets/uploads/2021/11/enoc-products.png',
    },
    {
      name: 'ADNOC',
      logo: 'https://arda.africa/wp-content/uploads/2022/08/Arda_Sponsor_Logos_Gold_Adnoc.png',
    },
    {
      name: 'PetroChina',
      logo: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Petrochina_logo.svg',
    },
  ];

  getTopPartners() {
    this.retailStationLogos = [];
    this.websiteService.GetTopPartners().subscribe(data => {
      data?.forEach(partner => {
        this.retailStationLogos.push({
          name: partner.displayName,
          logo: partner.image});
      });

    }, err => {
    }, () => {
    });
  }
}
