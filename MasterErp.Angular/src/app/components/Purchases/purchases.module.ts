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


@NgModule({
  declarations: [
    PurchasesLayoutComponent,
    AddPurchaseInvoiceComponent,
    AddPurchaseOrderComponent,
    AddPurchaseReturnsComponent,
    PurchaseInvoicesComponent,
    PurchaseOrdersComponent,
    PurchaseReturnsComponent,
    SuppliersAccountStatementComponent,
    InvoiceSearchSidepanelComponent,
    InvoiceDetailsSidepanelComponent,
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
