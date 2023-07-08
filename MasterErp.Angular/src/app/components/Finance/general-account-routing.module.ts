import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from './BasicInformation/currency/currency.component';
import { FeaturedComponent } from './BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './BasicInformation/receipt-books/receipt-books.component';
import { AccountTreeComponent } from './GeneralAccounts/components/account-tree/account-tree.component';
import { CostCenterTreeComponent } from './GeneralAccounts/components/cost-center-tree/cost-center-tree.component';
import { PurchaseInvoiceComponent } from './Purchase/components/purchase-invoice/purchase-invoice.component';
import { AddPurchaseComponent } from './Purchase/components/add-purchase/add-purchase.component';
import { SalesInvoiceComponent } from './Sales/components/sales-invoice/sales-invoice.component';
import { AddSalesComponent } from './Sales/components/add-sales/add-sales.component';
import { NewEntryComponent } from './GeneralAccounts/components/new-entry/new-entry.component';
import { JournalDailyListComponent } from './GeneralAccounts/components/journal-daily-list/journal-daily-list.component';

const routes: Routes = [
  {path:'currency',component:CurrencyComponent},
  {path:'featured',component:FeaturedComponent},
  {path:'fiscalYear',component:FiscalYearComponent},
  {path:'receiptBooks',component:ReceiptBooksComponent},
  {path:'accountTree',component:AccountTreeComponent},
  {path:'costCenterTree',component:CostCenterTreeComponent},
  {path:'purchaseInvoice',component:PurchaseInvoiceComponent},
  {path:'addPurchase',component:AddPurchaseComponent},
  {path:'salesInvoice',component:SalesInvoiceComponent},
  {path:'addSales',component:AddSalesComponent},
  {path:'newEntry',component:NewEntryComponent},
  {path:'journalDailyList',component:JournalDailyListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAccountRoutingModule { }
