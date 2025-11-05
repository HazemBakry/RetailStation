import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteComponent } from './components/website.component';
import { websiteProductDetailsComponent } from './components/website-product-details/website-product-details.component';
import { WebsiteCartComponent } from './components/website-cart/website-cart.component';
import { WebsiteHomeComponent } from './components/website-home/website-home.component';
import { WebsiteAboutUsComponent } from './components/website-about-us/website-about-us.component';
import { WebsiteContactComponent } from './components/website-contact/website-contact.component';
import { WebsiteBlogComponent } from './components/website-blog/website-blog.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { WebsiteFavoritesComponent } from './components/website-favorites/website-favorites.component';


const routes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      { path: '', component: WebsiteHomeComponent },
      { path: 'home', component: WebsiteHomeComponent },
      { path: 'cart', component: WebsiteCartComponent },
      { path: 'favorites', component: WebsiteFavoritesComponent },
      { path: 'product-details', component: websiteProductDetailsComponent },
      { path: 'contact-us', component: WebsiteContactComponent },
      { path: 'about-us', component: WebsiteAboutUsComponent },
      { path: 'blogs', component: WebsiteBlogComponent },
      { path: 'blog-details', component: BlogDetailsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
