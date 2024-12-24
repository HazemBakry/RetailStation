import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { AddPurchaseInvoiceComponent } from './components/add-purchase-invoice/add-purchase-invoice.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';
import { AddPurchaseReturnsComponent } from './components/add-purchase-returns/add-purchase-returns.component';
import { InvoiceDetailsSidepanelComponent } from './components/invoice-details-sidepanel/invoice-details-sidepanel.component';
import { InvoiceSearchSidepanelComponent } from './components/invoice-search-sidepanel/invoice-search-sidepanel.component';
import { PurchaseInvoicesComponent } from './components/purchase-invoices/purchase-invoices.component';
import { PurchaseOrdersComponent } from './components/purchase-orders/purchase-orders.component';
import { PurchaseReturnsComponent } from './components/purchase-returns/purchase-returns.component';
import { SuppliersAccountStatementComponent } from './components/suppliers-account-statement/suppliers-account-statement.component';
import { PurchasesLayoutComponent } from './purchases-layout/purchases-layout.component';
import { SupplierReturnsVouchersComponent } from './components/supplier-returns-vouchers/supplier-returns-vouchers.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { PurchasesHomeComponent } from './components/purchases-home/purchases-home.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { AddSupplierReturnsVoucherComponent } from './components/add-supplier-returns-voucher/add-supplier-returns-voucher.component';
import { AddPurchaseQuotationComponent } from './components/add-purchase-quotation/add-purchase-quotation.component';
import { PurchaseQuotationsComponent } from './components/purchase-quotations/purchase-quotations.component';


@NgModule({
  declarations: [
    PurchasesLayoutComponent,
    AddPurchaseInvoiceComponent,
    AddPurchaseOrderComponent,
    AddPurchaseReturnsComponent,
    AddSupplierReturnsVoucherComponent,
    PurchaseInvoicesComponent,
    PurchaseOrdersComponent,
    PurchaseReturnsComponent,
    SuppliersAccountStatementComponent,
    InvoiceSearchSidepanelComponent,
    InvoiceDetailsSidepanelComponent,
    SupplierReturnsVouchersComponent,
    SuppliersListComponent,
    PurchasesHomeComponent,
    AddSupplierComponent,
    AddPurchaseQuotationComponent,
    PurchaseQuotationsComponent,
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class PurchasesModule { }
