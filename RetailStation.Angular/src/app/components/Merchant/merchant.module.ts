import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantProfileComponent } from './components/merchant-profile/merchant-profile.component';
import { BranchesComponent } from './components/branches/branches.component';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { MerchantDashboardComponent } from './components/merchant-dashboard/merchant-dashboard.component';
import { MerchantItemsComponent } from './components/merchant-items/merchant-items.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SalesRoutingModule } from './merchant-routing.module';
import { MerchantPromotionsComponent } from './components/merchant-promotions/merchant-promotions.component';
import { MerchantOrdersComponent } from './components/merchant-orders/merchant-orders.component';
import { MerchantDeliveryRegionsComponent } from './components/merchant-delivery-regions/merchant-delivery-regions.component';


@NgModule({
  declarations: [
    MerchantLayoutComponent,
    MerchantDashboardComponent,
    OrdersComponent,
    MerchantItemsComponent,
    MerchantPromotionsComponent,
    MerchantProfileComponent,
    BranchesComponent,
    MerchantOrdersComponent,
    MerchantDeliveryRegionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SalesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MerchantModule { }
