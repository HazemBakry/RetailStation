import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: ErpLoginComponent },
  { path: 'dashboard', component: DashboardComponent },
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
