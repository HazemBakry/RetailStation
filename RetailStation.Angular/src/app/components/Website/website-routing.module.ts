import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    // path: '',
    // component: MainLayoutComponent,
    // children: [
    //   { path: 'home', component: MainHomeComponent },
    //   { path: 'home/:tabName', component: MainHomeComponent },
    //   { path: 'merchant-items', component: SupplierItemsComponent },
    //   { path: 'merchant-orders', component: SupplierOrdersComponent },
    //   { path: 'merchant-invoices', component: SupplierInvoicesComponent },
    //   { path: '', redirectTo: 'home', pathMatch: 'full' },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
