import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from '../Shared/components/BasicInformation/currency/currency.component';
import { FeaturedComponent } from '../Shared/components/BasicInformation/featured/featured.component';
import { FiscalYearComponent } from '../Shared/components/BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from '../Shared/components/BasicInformation/receipt-books/receipt-books.component';
import { AccountsAssistantLedgerComponent } from './components/accounts-assistant-ledger/accounts-assistant-ledger.component';
import { AccountsGeneralLedgerComponent } from './components/accounts-general-ledger/accounts-general-ledger.component';
import { CostAssistantLedgerComponent } from './components/cost-assistant-ledger/cost-assistant-ledger.component';
import { CostGeneralLedgerComponent } from './components/cost-general-ledger/cost-general-ledger.component';
import { CreatePaymentReceiptComponent } from './components/create-payment-receipt/create-payment-receipt.component';
import { CreateReceiveReceiptComponent } from './components/create-receive-receipt/create-receive-receipt.component';
import { JournalDailyListComponent } from './components/journal-daily-list/journal-daily-list.component';
import { MonthlyAssistantLedgerComponent } from './components/monthly-assistant-ledger/monthly-assistant-ledger.component';
import { PaymentReceiptsComponent } from './components/payment-receipts/payment-receipts.component';
import { ReceiveReceiptsComponent } from './components/receive-receipts/receive-receipts.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { GeneralAccountsLayoutComponent } from './general-accounts-layout/general-accounts-layout.component';
import { CostTrialBalanceComponent } from './components/cost-trial-balance/cost-trial-balance.component';
import { CostCenterMatrixComponent } from './components/cost-center-matrix/cost-center-matrix.component';
import { ReceiptLedgersComponent } from './components/receipt-ledgers/receipt-ledgers.component';
import { FinancialPeriodsComponent } from './components/financial-periods/financial-periods.component';
import { JournalEntryTypesComponent } from './components/journal-entry-types/journal-entry-types.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { AccountTreeContainerComponent } from './components/account-tree-container/account-tree-container.component';
import { CostCenterTreeContainerComponent } from './components/cost-center-tree-container/cost-center-tree-container.component';
import { GeneralAccountsHomeComponent } from './components/general-accounts-home/general-accounts-home.component';
import { PaymentTermComponent } from './GeneralAccountSettings/payment-term/payment-term.component';
import { TaxCalculationComponent } from './GeneralAccountSettings/tax-calculation/tax-calculation.component';
import { DailyNotebookComponent } from './GeneralAccountSettings/daily-notebook/daily-notebook.component';
import { AssetsFormComponent } from './GeneralAccountSettings/assets-form/assets-form.component';
import { LoansComponent } from './components/loans/loans.component';
import { LedgerJournalTypeComponent } from './GeneralAccountSettings/ledger-journal-type/ledger-journal-type.component';
import { CustomersComponent } from './Customers/customers/customers.component';
import { BatchesComponent } from './Customers/batches/batches.component';
import { CreateJournalEntryComponent } from './components/create-journal-entry/create-journal-entry.component';
import { PaymentOrdersComponent } from './components/payment-orders/payment-orders.component';
import { CreatePaymentOrderComponent } from './components/create-payment-order/create-payment-order.component';
import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
import { CreateJournalEntryTemplateComponent } from './components/create-journal-entry-template/create-journal-entry-template.component';
import { JournalEntryTemplatesComponent } from './components/journal-entry-templates/journal-entry-templates.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralAccountsLayoutComponent,
    children: [

      { path: 'home', component: GeneralAccountsHomeComponent },
      { path: 'currency', component: CurrencyComponent },
      { path: 'featured', component: FeaturedComponent },
      { path: 'fiscalYear', component: FiscalYearComponent },
      { path: 'receiptBooks', component: ReceiptBooksComponent },
      { path: 'account-tree', component: AccountTreeContainerComponent },
      { path: 'cost-center-tree', component: CostCenterTreeContainerComponent },
      { path: 'new-entry-template', component: CreateJournalEntryTemplateComponent },
      { path: 'journal-entry-templates', component: JournalEntryTemplatesComponent },
      { path: 'new-entry', component: CreateJournalEntryComponent },
      { path: 'journal-daily-list', component: JournalDailyListComponent },
      { path: 'create-payment-order', component: CreatePaymentOrderComponent },
      { path: 'create-payment-receipt', component: CreatePaymentReceiptComponent },
      { path: 'create-receive-receipt', component:  CreateReceiveReceiptComponent},
      { path: 'payment-receipts', component: PaymentReceiptsComponent },
      { path: 'payment-orders', component: PaymentOrdersComponent },
      { path: 'receive-receipts', component: ReceiveReceiptsComponent },
      { path: 'accounts-general-ledger', component: AccountsGeneralLedgerComponent },
      { path: 'accounts-assistant-ledger', component: AccountsAssistantLedgerComponent },
      { path: 'monthly-assistant-ledger', component: MonthlyAssistantLedgerComponent },
      { path: 'trial-balance', component: TrialBalanceComponent },
      { path: 'balance-sheet', component: BalanceSheetComponent },
      { path: 'cost-general-ledger', component: CostGeneralLedgerComponent },
      { path: 'cost-assistant-ledger', component: CostAssistantLedgerComponent },
      { path: 'cost-trial-balance', component: CostTrialBalanceComponent },
      { path: 'cost-center-matrix', component: CostCenterMatrixComponent },
      { path: 'journal-entry-types', component: JournalEntryTypesComponent },
      { path: 'receipt-ledgers', component: ReceiptLedgersComponent },
      { path: 'financial-period', component: FinancialPeriodsComponent },
      { path: 'opening-balance', component: OpeningBalanceComponent },
      { path: 'payment-terms', component: PaymentTermComponent },
      { path: 'tax-calculation', component: TaxCalculationComponent },
      { path: 'daily-notebook', component: DailyNotebookComponent },
      { path: 'assets-form', component: AssetsFormComponent },
      { path: 'loans', component: LoansComponent },
      { path: 'ledger-journal-types', component: LedgerJournalTypeComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'batches', component: BatchesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },


    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAccountsRoutingModule { }
