import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { OrdersComponent } from './components/orders/orders.component';
import { MerchantProfileComponent } from './components/merchant-profile/merchant-profile.component';
import { BranchesComponent } from './components/branches/branches.component';
import { MerchantDashboardComponent } from './components/merchant-dashboard/merchant-dashboard.component';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { MerchantItemsComponent } from './components/merchant-items/merchant-items.component';
import { MerchantPromotionsComponent } from './components/merchant-promotions/merchant-promotions.component';
import { MerchantOrdersComponent } from './components/merchant-orders/merchant-orders.component';
import { MerchantDeliveryRegionsComponent } from './components/merchant-delivery-regions/merchant-delivery-regions.component';



const routes: Routes = [
  {
    path: '',
    component: MerchantLayoutComponent,
    children: [
      { path: 'dashboard', component: MerchantDashboardComponent, canActivate: [AuthPageGuard], data: { pageName: 'SalesDashboard' } },
      // { path: 'home', component: SalesHomeComponent, canActivate: [AuthPageGuard], data: { pageName: 'SalesDashboard' } },
      // { path: 'home/:tabName', component: SalesHomeComponent },
      { path: 'merchant-orders', component: MerchantOrdersComponent, canActivate: [AuthPageGuard], data: { pageName: 'Orders' } },
      { path: 'merchant-items', component: MerchantItemsComponent, },//canActivate: [AuthPageGuard], data: { pageName: 'Items' } },
      { path: 'merchant-promotions', component: MerchantPromotionsComponent, canActivate: [AuthPageGuard], data: { pageName: 'promotions' } },
      { path: 'merchant-profile', component: MerchantProfileComponent, canActivate: [AuthPageGuard], data: { pageName: 'merchant-profile' } },
      { path: 'merchant-branches', component: BranchesComponent, canActivate: [AuthPageGuard], data: { pageName: 'branches' } },
      { path: 'merchant-delivery-regions', component: MerchantDeliveryRegionsComponent, canActivate: [AuthPageGuard], data: { pageName: 'branches' } },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];








@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
