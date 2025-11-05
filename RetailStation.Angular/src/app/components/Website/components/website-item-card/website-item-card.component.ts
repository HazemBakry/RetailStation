import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { environment } from 'src/environments/environment';
import {
  CartModel,
  CartService,
} from 'src/app/components/Shared/services/cart.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { WebsiteService } from '../../services/website.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-website-item-card',
  templateUrl: './website-item-card.component.html',
  styleUrls: ['./website-item-card.component.css'],
})
export class WebsiteItemCardComponent implements OnInit {
  @Input() item!: any;
  @Input() isAuthenticated: boolean = false;
  isItemInCart = false;
  systemURL: string = environment.systemUrl;

  isCounterMode = false;

  merchantLogo: string =
    'https://s3-eu-west-1.amazonaws.com/elmenusv5-stg/Thumbnail/fa4f0bed-7ae1-4381-a81c-455259a981bf.jpg';
  defaultItemImage = `${this.systemURL}assets/images/13.png`;
  constructor(
    config: NgbCarouselConfig,
    private compareService: CompareService,
    private cartService: CartService,
    private websiteService: WebsiteService,
    private toaster: ToastrService
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
  }
  ngOnInit(): void {
    this.checkCompareAdded();
    this.checkCartAdded();
    // this.compareService.compareList$.subscribe(list => {
    //   this.checkCompareAdded();
    // });
  }
  checkCompareAdded() {
    this.item.isCompareAdded = this.compareService.isItemInList(
      this.item.merchantItemId
    );
  }

  toggleCompare(item: MerchantItemModel): void {
    if (item.isCompareAdded) {
      this.compareService.removeItem(item.merchantItemId, item.itemId);
    } else {
      this.compareService.addItem(item.merchantItemId, item.itemId);
    }
    this.checkCompareAdded();
  }
  toggleFavorite(item: MerchantItemModel): void {
    item.isFavorite = !item.isFavorite;
     this.websiteService.ToggleFavorite(item.merchantItemId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
    }, err => {
    }, () => {
    });
  }

  checkCartAdded() {
    // this.cartService.cartItems$.subscribe(items => {
    //   this.isItemInCart = items.some(cartItem => cartItem.merchantItemId === this.item.merchantItemId);
    // });
    this.isItemInCart = this.cartService.isItemInList(this.item.merchantItemId);
    if(this.isItemInCart)
    {
      this.itemQuantity = this.cartService.getItemQuantity(this.item.merchantItemId) ?? 1;
    }
  }
  addToCart(): void {
    const cartItem: CartModel = {
      merchantItemId: this.item.merchantItemId,
      quantity: 1,
      userId: '',
    };
    this.cartService.addItem(cartItem);
    this.checkCartAdded();
  }

  removeItem(): void {
    this.cartService.removeItem(this.item.merchantItemId);
    this.checkCartAdded();
  }

  itemQuantity: number = 1;
  addQuantity(qty: number) {
    if (this.itemQuantity + qty > 0) {
      this.itemQuantity = this.itemQuantity + qty;
      this.cartService.changeItemQuantity(this.item.merchantItemId,this.itemQuantity);
    }
  }
}
