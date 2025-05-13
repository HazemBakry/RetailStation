import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPurchaseInvoiceComponent } from './components/add-purchase-invoice/add-purchase-invoice.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';
import { AddPurchaseReturnsComponent } from './components/add-purchase-returns/add-purchase-returns.component';
import { PurchaseInvoicesComponent } from './components/purchase-invoices/purchase-invoices.component';
import { PurchaseOrdersComponent } from './components/purchase-orders/purchase-orders.component';
import { PurchaseReturnsComponent } from './components/purchase-returns/purchase-returns.component';
import { SuppliersAccountStatementComponent } from './components/suppliers-account-statement/suppliers-account-statement.component';
import { SupplierReturnsVouchersComponent } from './components/supplier-returns-vouchers/supplier-returns-vouchers.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { PurchasesHomeComponent } from './components/purchases-home/purchases-home.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { AddSupplierReturnsVoucherComponent } from './components/add-supplier-returns-voucher/add-supplier-returns-voucher.component';
import { PurchaseQuotationsComponent } from './components/purchase-quotations/purchase-quotations.component';
import { AddPurchaseQuotationComponent } from './components/add-purchase-quotation/add-purchase-quotation.component';
import { PurchasesLayoutComponent } from './purchases-layout/purchases-layout.component';

const routes: Routes = [
  {

    path: '',
    component: PurchasesLayoutComponent,
    children: [
      { path: 'home', component: PurchasesHomeComponent },
      { path: 'home/:tabName', component: PurchasesHomeComponent },
      { path: 'purchase-invoices', component: PurchaseInvoicesComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent },
      { path: 'purchase-returns', component: PurchaseReturnsComponent },
      { path: 'add-purchase-invoice', component: AddPurchaseInvoiceComponent },
      { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
      { path: 'add-purchase-returns', component: AddPurchaseReturnsComponent },
      { path: 'suppliers-account-statement', component: SuppliersAccountStatementComponent },
      { path: 'supplier-returns-voucher', component: SupplierReturnsVouchersComponent },
      { path: 'add-supplier-returns-voucher', component: AddSupplierReturnsVoucherComponent },
      { path: 'suppliers-list', component: SuppliersListComponent },
      { path: 'add-supplier', component: AddSupplierComponent },
      { path: 'purchase-quotations', component: PurchaseQuotationsComponent },
      { path: 'add-purchase-quotation', component: AddPurchaseQuotationComponent },
      { path: '', redirectTo: 'home' ,pathMatch: 'full' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
