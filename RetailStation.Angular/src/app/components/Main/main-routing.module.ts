import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { SupplierItemsComponent } from './components/supplier/supplier-items/supplier-items.component';
import { SupplierOrdersComponent } from './components/supplier/supplier-orders/supplier-orders.component';
import { SupplierInvoicesComponent } from './components/supplier/supplier-invoices/supplier-invoices.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: MainHomeComponent },
      { path: 'home/:tabName', component: MainHomeComponent },
      { path: 'supplier-items', component: SupplierItemsComponent },
      { path: 'supplier-orders', component: SupplierOrdersComponent },
      { path: 'supplier-invoices', component: SupplierInvoicesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
