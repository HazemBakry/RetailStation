import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPurchaseInvoiceComponent } from './components/add-purchase-invoice/add-purchase-invoice.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';
import { AddPurchaseReturnsComponent } from './components/add-purchase-returns/add-purchase-returns.component';
import { PurchaseInvoicesComponent } from './components/purchase-invoices/purchase-invoices.component';
import { PurchaseOrdersComponent } from './components/purchase-orders/purchase-orders.component';
import { PurchaseReturnsComponent } from './components/purchase-returns/purchase-returns.component';
import { SuppliersAccountStatementComponent } from './components/suppliers-account-statement/suppliers-account-statement.component';
import { PurchasesLayoutComponent } from './purchases-layout/purchases-layout.component';

const routes: Routes = [
  {

    path: '',
    component: PurchasesLayoutComponent,
    children: [
      { path: 'purchase-invoices', component: PurchaseInvoicesComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent },
      { path: 'purchase-returns', component: PurchaseReturnsComponent },
      { path: 'add-purchase-invoice', component: AddPurchaseInvoiceComponent },
      { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
      { path: 'add-purchase-returns', component: AddPurchaseReturnsComponent },
      { path: 'suppliers-account-statement', component: SuppliersAccountStatementComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
