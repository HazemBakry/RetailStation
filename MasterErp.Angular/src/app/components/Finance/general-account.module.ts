import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAccountRoutingModule } from './general-account-routing.module';
import { CurrencyComponent } from './BasicInformation/currency/currency.component';
import { FeaturedComponent } from './BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './BasicInformation/receipt-books/receipt-books.component';
import { AccountTreeComponent } from './GeneralAccounts/components/account-tree/account-tree.component';
import { SharedModule } from '../Shared/shared.module';
import { CostCenterTreeComponent } from './GeneralAccounts/components/cost-center-tree/cost-center-tree.component';
import { PurchaseInvoiceComponent } from './Purchase/components/purchase-invoice/purchase-invoice.component';
import { AddPurchaseComponent } from './Purchase/components/add-purchase/add-purchase.component';
import { SalesInvoiceComponent } from './Sales/components/sales-invoice/sales-invoice.component';
import { AddSalesComponent } from './Sales/components/add-sales/add-sales.component';
import { FormsModule } from '@angular/forms';
import { NewEntryComponent } from './GeneralAccounts/components/new-entry/new-entry.component';
import { JournalDailyListComponent } from './GeneralAccounts/components/journal-daily-list/journal-daily-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CurrencyComponent,
    FeaturedComponent,
    FiscalYearComponent,
    ReceiptBooksComponent,
    AccountTreeComponent,
    CostCenterTreeComponent,
    PurchaseInvoiceComponent,
    AddPurchaseComponent,
    SalesInvoiceComponent,
    AddSalesComponent,
    NewEntryComponent,
    JournalDailyListComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    GeneralAccountRoutingModule,
    SharedModule
  ]
})
export class GeneralAccountModule { }
