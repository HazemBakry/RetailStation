import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { SupplierItemModel } from '../../../models/SupplierItemModel';
import { WebsiteService } from '../../../services/website.service';
import { CartModel, CartService } from 'src/app/components/Shared/services/cart.service';

@Component({
  selector: 'app-website-item-card',
  templateUrl: './website-item-card.component.html',
  styleUrls: ['./website-item-card.component.css']
})
export class WebsiteItemCardComponent implements OnInit {
  @Input() item!: SupplierItemModel;
  isItemInCart = false;
  systemURL: string = environment.systemUrl;

  supplierLogo: string = 'https://s3-eu-west-1.amazonaws.com/elmenusv5-stg/Thumbnail/fa4f0bed-7ae1-4381-a81c-455259a981bf.jpg'
  defaultItemImage = `${this.systemURL}assets/images/13.png`;
  constructor(config: NgbCarouselConfig, private compareService: CompareService, private cartService: CartService) {
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
    this.item.isCompareAdded = this.compareService.isItemInList(this.item.supplierItemId);
  }


  toggleCompare(item: SupplierItemModel): void {
    if (item.isCompareAdded) {
      this.compareService.removeItem(item.supplierItemId, item.itemId);
    } else {
      this.compareService.addItem(item.supplierItemId, item.itemId);
    }
    this.checkCompareAdded();
  }


  checkCartAdded() {
    // this.cartService.cartItems$.subscribe(items => {
    //   this.isItemInCart = items.some(cartItem => cartItem.supplierItemId === this.item.supplierItemId);
    // });
    this.isItemInCart = this.cartService.isItemInList(this.item.supplierItemId);
  }
  addToCart(): void {

    const cartItem: CartModel = {
      supplierItemId: this.item.supplierItemId,
      quantity: 1,
      userId: ''
    };
    this.cartService.addItem(cartItem);
    this.checkCartAdded();
  }

  removeItem(): void {
    this.cartService.removeItem(this.item.supplierItemId);
    this.checkCartAdded();
  }
}
