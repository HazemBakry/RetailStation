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
import { AddPurchaseInvoiceComponent } from './Purchase/components/add-purchase-invoice/add-purchase-invoice.component';
import { AddPurchaseOrderComponent } from './Purchase/components/add-purchase-order/add-purchase-order.component';
import { AddPurchaseReturnsComponent } from './Purchase/components/add-purchase-returns/add-purchase-returns.component';
import { PurchaseInvoicesComponent } from './Purchase/components/purchase-invoices/purchase-invoices.component';
import { PurchasesLayoutComponent } from './Purchase/purchases-layout.component';
import { PurchaseOrdersComponent } from './Purchase/components/purchase-orders/purchase-orders.component';
import { PurchaseReturnsComponent } from './Purchase/components/purchase-returns/purchase-returns.component';
import { SuppliersAccountStatementComponent } from './Purchase/components/suppliers-account-statement/suppliers-account-statement.component';
import { CreatePaymentReceiptComponent } from './GeneralAccounts/components/create-payment-receipt/create-payment-receipt.component';
import { CreateReceiveReceiptComponent } from './GeneralAccounts/components/create-receive-receipt/create-receive-receipt.component';
import { PaymentReceiptsComponent } from './GeneralAccounts/components/payment-receipts/payment-receipts.component';
import { ReceiveReceiptsComponent } from './GeneralAccounts/components/receive-receipts/receive-receipts.component';

const routes: Routes = [
  // {path:'newReceiveReceipt',component:CashReceiveReceiptComponent},

  {

    path: 'purchases',
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
  },
  {
    path: 'generalAccounts',
    component: PurchasesLayoutComponent,
    children: [

      { path: 'currency', component: CurrencyComponent },
      { path: 'featured', component: FeaturedComponent },
      { path: 'fiscalYear', component: FiscalYearComponent },
      { path: 'receiptBooks', component: ReceiptBooksComponent },
      { path: 'account-tree', component: AccountTreeComponent },
      { path: 'cost-center-tree', component: CostCenterTreeComponent },
      { path: 'sales-invoice', component: SalesInvoiceComponent },
      { path: 'add-sales', component: AddSalesComponent },
      { path: 'new-entry', component: NewEntryComponent },
      { path: 'journal-daily-list', component: JournalDailyListComponent },
      { path: 'create-payment-receipt', component: CreatePaymentReceiptComponent },
      { path: 'create-receive-receipt', component: CreateReceiveReceiptComponent },
      { path: 'payment-receipts', component: PaymentReceiptsComponent },
      { path: 'receive-receipts', component: ReceiveReceiptsComponent },

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
