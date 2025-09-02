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
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { PurchaseInvoiceTypesComponent } from './components/purchase-invoice-types/purchase-invoice-types.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesLayoutComponent,
    children: [
      { path: 'home', component: PurchasesHomeComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchasesDashboard' } },
      { path: 'home/:tabName', component: PurchasesHomeComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchaseOrders' } },
      { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
      { path: 'purchase-invoices', component: PurchaseInvoicesComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchaseInvoices' } },
      { path: 'add-purchase-invoice', component: AddPurchaseInvoiceComponent },
      { path: 'purchase-returns', component: PurchaseReturnsComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchaseReturns' } },
      { path: 'add-purchase-returns', component: AddPurchaseReturnsComponent },
      { path: 'suppliers-account-statement', component: SuppliersAccountStatementComponent, canActivate: [AuthPageGuard], data: { pageName: 'SuppliersAccountStatement' } },
      { path: 'supplier-returns-voucher', component: SupplierReturnsVouchersComponent, canActivate: [AuthPageGuard], data: { pageName: 'SupplierReturnsVoucher' } },
      { path: 'add-supplier-returns-voucher', component: AddSupplierReturnsVoucherComponent },
      { path: 'purchase-quotations', component: PurchaseQuotationsComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchaseQuotations' } },
      { path: 'add-purchase-quotation', component: AddPurchaseQuotationComponent },
      { path: 'suppliers-list', component: SuppliersListComponent, canActivate: [AuthPageGuard], data: { pageName: 'SuppliersList' } },
      { path: 'add-supplier', component: AddSupplierComponent },
      { path: 'purchase-invoice-types', component: PurchaseInvoiceTypesComponent, data: { pageName: 'PurchaseInvoiceTypes' } },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
