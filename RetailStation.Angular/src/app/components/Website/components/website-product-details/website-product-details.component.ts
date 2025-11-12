import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { CartModel, CartService } from 'src/app/components/Shared/services/cart.service';

@Component({
  selector: 'app-website-product-details',
  templateUrl: './website-product-details.component.html',
  styleUrls: ['./website-product-details.component.css']
})
export class websiteProductDetailsComponent implements OnInit {
  itemModel: MerchantItemModel = {} as MerchantItemModel;
  showLoader: boolean = false;
  merchantItemId: any;
  isItemInCart = false;
  itemQuantity: number = 1;

  constructor(private acRoute: ActivatedRoute,
    private websiteService: WebsiteService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.ItemId) {
        this.merchantItemId = params.ItemId;
        this.getProductDetails();
      }
    })
  }

  getProductDetails() {
    this.showLoader = true;
    this.websiteService.GetWebsiteItemDetailsById(this.merchantItemId).subscribe(data => {
      if (data) {
        this.itemModel = data;
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }

  checkCartAdded() {
    // this.cartService.cartItems$.subscribe(items => {
    //   this.isItemInCart = items.some(cartItem => cartItem.merchantItemId === this.item.merchantItemId);
    // });
    this.isItemInCart = this.cartService.isItemInList(this.merchantItemId);
    if (this.isItemInCart) {
      this.itemQuantity = this.cartService.getItemQuantity(this.merchantItemId) ?? 1;
    }
  }
  
  addToCart(): void {
    const cartItem: CartModel = {
      merchantItemId: this.merchantItemId,
      quantity: 1,
      userId: '',
    };
    this.cartService.addItem(cartItem);
    this.checkCartAdded();
  }

  changeQuantity(item: MerchantItemModel, newQuantity: number): void {
    if (item.quantity + newQuantity > 0) {
      // this.itemQuantity = this.itemQuantity + qty;
      this.cartService.changeItemQuantity(item.merchantItemId, item.quantity + newQuantity);
      //this.setQuantity();
    }
  }

  removeItem(item: any) {
    this.cartService.removeItem(item.merchantItemId);
    //this.loadData();
  }


}
