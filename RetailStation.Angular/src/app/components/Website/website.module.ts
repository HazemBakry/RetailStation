import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { WebsiteComponent } from './components/website.component';
import { WebsiteHomeComponent } from './components/website-home/website-home.component';
import { WebsiteSliderComponent } from './components/website-slider/website-slider.component';
import { WebsitePromotionItemsComponent } from './components/website-promotion-items/website-promotion-items.component';
import { WebsiteMainItemsComponent } from './components/website-main-items/website-main-items.component';
import { WebsiteMainCategoriesComponent } from './components/website-main-categories/website-main-categories.component';
import { WebsiteFiltersComponent } from './components/website-filters/website-filters.component';
import { WebsiteItemCardComponent } from './components/website-item-card/website-item-card.component';
import { WebsiteCartComponent } from './components/website-cart/website-cart.component';
import { WebsiteHeaderComponent } from './components/website-header/website-header.component';
import { WebsiteSearchComponent } from './components/website-search/website-search.component';
import { WebsiteRoutingModule } from './website-routing.module';
import { websiteProductDetailsComponent } from './components/website-product-details/website-product-details.component';
import { WebsiteAboutUsComponent } from './components/website-about-us/website-about-us.component';
import { WebsiteContactComponent } from './components/website-contact/website-contact.component';
import { WebsiteBlogComponent } from './components/website-blog/website-blog.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { WebsiteTopPartnersComponent } from './components/website-top-partners/website-top-partners.component';
import { WebsiteFavoritesComponent } from './components/website-favorites/website-favorites.component';
import { WebsiteCategoriesComponent } from './components/website-categories/website-categories.component';
import { WebsiteBestSellerItemsComponent } from './components/website-best-seller-items/website-best-seller-items.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WebsiteTotalValuePromotionsComponent } from './components/website-total-value-promotions/website-total-value-promotions.component';



@NgModule({
  declarations: [
    WebsiteComponent,
    WebsiteHomeComponent,
    WebsiteSliderComponent,
    WebsitePromotionItemsComponent,
    WebsiteMainItemsComponent,
    WebsiteMainCategoriesComponent,
    WebsiteFiltersComponent,
    WebsiteItemCardComponent,
    WebsiteCartComponent,
    WebsiteHeaderComponent,
    WebsiteSearchComponent,
    websiteProductDetailsComponent,
    WebsiteAboutUsComponent,
    WebsiteContactComponent,
    WebsiteBlogComponent,
    BlogDetailsComponent,
    PrivacyPolicyComponent,
    WebsiteTopPartnersComponent,
    WebsiteFavoritesComponent,
    WebsiteMainCategoriesComponent,
    WebsiteCategoriesComponent,
    WebsiteBestSellerItemsComponent,
    MyOrdersComponent,
    UserProfileComponent,
    WebsiteTotalValuePromotionsComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WebsiteModule { }
