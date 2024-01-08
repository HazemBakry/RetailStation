import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { ReviewsComponent } from './components/Main/reviews/reviews.component';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';
import { SigninComponent } from './components/signin/signin.component';
import { AccountTreeComponent } from './components/design/account-tree/account-tree.component';
import { OpeningBalanceComponent } from './components/design/opening-balance/opening-balance.component';
import { ReceiptsComponent } from './components/design/receipts/receipts.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'account-tree', component: AccountTreeComponent },
  { path: 'opening-balance', component: OpeningBalanceComponent },
  { path: 'receipts', component: ReceiptsComponent },
  { path: 'Hr', loadChildren: () => import('./components/HR/hr.module').then(erp => erp.HrModule) },
  { path: 'Purchases', loadChildren: () => import('./components/Purchases/purchases.module').then(erp => erp.PurchasesModule) },
  { path: 'Sales', loadChildren: () => import('./components/Sales/sales.module').then(erp => erp.SalesModule) },
  { path: 'GeneralAccounts', loadChildren: () => import('./components/GeneralAccounts/general-accounts.module').then(erp => erp.GeneralAccountsModule) },
  { path: 'Inventory', loadChildren: () => import('./components/Inventory/inventory.module').then(erp => erp.InventoryModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
