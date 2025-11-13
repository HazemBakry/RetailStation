import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { CartModel, CartService } from 'src/app/components/Shared/services/cart.service';

@Component({
  selector: 'app-website-product-details',
  templateUrl: './website-product-details.component.html',
  styleUrls: ['./website-product-details.component.scss']
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
    });
    this.loadProductDetails(123);
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
  



  product: any | null = null;
    mainImage: string = '';
    quantity: number = 1;
    selectedColor: string = 'Space Gray'; // Default selected variation
  loadProductDetails(productId: number): void {
    // Simulate API call to fetch product details
    const dummyProduct: any = {
      id: productId,
      title: 'Apple iPad Pro 11-inch (M4) 1TB',
      vendorName: 'متجر الصفوة الإلكتروني',
      description: 'جهاز لوحي فائق النحافة مع شاشة Ultra Retina XDR ومحرك M4 قوي لأداء لا مثيل له في الرسومات والتعلم الآلي. يأتي بسعة تخزين كبيرة ومثالي للمحترفين.',
      price: 5299.00,
      oldPrice: 5999.00,
      inStock: true,
      isBestSeller: true,
      hasVariations: true,
      minimumOrderQuantity: 1,
      images: [
        { url: 'https://via.placeholder.com/600x400/999999/ffffff?text=iPad+Front' },
        { url: 'https://via.placeholder.com/600x400/000000/ffffff?text=iPad+Back' },
        { url: 'https://via.placeholder.com/600x400/aaaaaa/000000?text=iPad+Side' },
      ],
      colors: [
        { name: 'Space Gray', hex: '#3C3C3C' },
        { name: 'Silver', hex: '#E0E0E0' },
      ],
      reviews: [],
      categoryName: 'موبايلات وتابلت'
    };

    this.product = dummyProduct;

    // Set initial main image
    if (this.product.images.length > 0) {
      this.mainImage = this.product.images[0].url;
    }
  }

  // --- Image Gallery Logic ---
  setMainImage(imageUrl: string): void {
    this.mainImage = imageUrl;
  }

  // --- Variation Logic ---
  selectColor(colorName: string): void {
    this.selectedColor = colorName;
    // Logic to potentially update price/stock based on variation selection would go here
  }

  // --- Quantity Logic ---
  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  // --- Purchasing Logic ---

}
