import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { MerchantItemsComponent } from './components/merchant/merchant-items/merchant-items.component';
import { MerchantInvoicesComponent } from './components/merchant/merchant-invoices/merchant-invoices.component';
import { MerchantOrdersComponent } from './components/merchant/merchant-orders/merchant-orders.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: MainHomeComponent },
      { path: 'home/:tabName', component: MainHomeComponent },
      { path: 'merchant-items', component: MerchantItemsComponent },
      { path: 'merchant-orders', component: MerchantOrdersComponent },
      { path: 'merchant-invoices', component: MerchantInvoicesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
