import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from './BasicInformation/currency/currency.component';
import { FeaturedComponent } from './BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './BasicInformation/receipt-books/receipt-books.component';
import { AccountTreeComponent } from './GeneralAccounts/components/account-tree/account-tree.component';
import { CostCenterTreeComponent } from './GeneralAccounts/components/cost-center-tree/cost-center-tree.component';
import { SalesInvoiceComponent } from './Sales/components/sales-invoice/sales-invoice.component';
import { AddSalesComponent } from './Sales/components/add-sales/add-sales.component';
import { NewEntryComponent } from './GeneralAccounts/components/new-entry/new-entry.component';
import { JournalDailyListComponent } from './GeneralAccounts/components/journal-daily-list/journal-daily-list.component';
import { CreatePurchasesInvoiceComponent } from './Purchase/components/create-purchases-invoice/create-purchases-invoice.component';
import { CreatePurchasesOrderComponent } from './Purchase/components/create-purchases-order/create-purchases-order.component';
import { CreatePurchasesReturnsComponent } from './Purchase/components/create-purchases-returns/create-purchases-returns.component';
import { PurchasesInvoicesComponent } from './Purchase/components/purchases-invoices/purchases-invoices.component';
import { PurchasesLayoutComponent } from './Purchase/purchases-layout.component';
import { PurchasesOrdersComponent } from './Purchase/components/purchases-orders/purchases-orders.component';
import { PurchasesReturnsComponent } from './Purchase/components/purchases-returns/purchases-returns.component';
import { SuppliersAccountStatementComponent } from './Purchase/components/suppliers-account-statement/suppliers-account-statement.component';

const routes: Routes = [
  {
    path:'purchases',
    component:PurchasesLayoutComponent,
    children:[
      {path:'purchasesInvoices',component:PurchasesInvoicesComponent},
      {path:'purchasesOrders',component:PurchasesOrdersComponent},
      {path:'purchasesReturns',component:PurchasesReturnsComponent},
      {path:'newPurchasesInvoice',component:CreatePurchasesInvoiceComponent},
      {path:'newPurchasesOrder',component:CreatePurchasesOrderComponent},
      {path:'newPurchasesReturns',component:CreatePurchasesReturnsComponent},
      {path:'suppliersAccountStatement',component:SuppliersAccountStatementComponent},
    ]
  },
  {
    path:'generalAccounts',
    component:PurchasesLayoutComponent,
    children:[
      {path:'currency',component:CurrencyComponent},
      {path:'featured',component:FeaturedComponent},
      {path:'fiscalYear',component:FiscalYearComponent},
      {path:'receiptBooks',component:ReceiptBooksComponent},
      {path:'accountTree',component:AccountTreeComponent},
      {path:'costCenterTree',component:CostCenterTreeComponent},
      {path:'salesInvoice',component:SalesInvoiceComponent},
      {path:'addSales',component:AddSalesComponent},
      {path:'newEntry',component:NewEntryComponent},
      {path:'journalDailyList',component:JournalDailyListComponent}
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
