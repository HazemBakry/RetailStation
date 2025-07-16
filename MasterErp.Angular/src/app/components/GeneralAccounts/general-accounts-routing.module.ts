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
import { LoansRequestsComponent } from './components/loans-requests/loans-requests.component';
import { AdvancesRequestsComponent } from './components/advances-requests/advances-requests.component';
import { IndebtednessPdfReportComponent } from './components/indebtedness-pdf-report/indebtedness-pdf-report.component';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { BanksComponent } from './GeneralAccountSettings/banks/banks.component';
import { DuesRequestsComponent } from './components/dues-requests/dues-requests.component';
import { MonthlySalariesComponent } from './components/monthly-salaries/monthly-salaries.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralAccountsLayoutComponent,
    children: [

      { path: 'home', component: GeneralAccountsHomeComponent },
      { path: 'home/:tabName', component: GeneralAccountsHomeComponent },
      { path: 'currency', component: CurrencyComponent, canActivate: [AuthPageGuard], data: { pageName: 'currency' } },
      { path: 'featured', component: FeaturedComponent, canActivate: [AuthPageGuard], data: { pageName: 'featured' } },
      { path: 'fiscalYear', component: FiscalYearComponent, canActivate: [AuthPageGuard], data: { pageName: 'fiscalYear' } },
      { path: 'receiptBooks', component: ReceiptBooksComponent, canActivate: [AuthPageGuard], data: { pageName: 'receiptBooks' } },
      { path: 'account-tree', component: AccountTreeContainerComponent, canActivate: [AuthPageGuard], data: { pageName: 'AccountTree' } },
      { path: 'cost-center-tree', component: CostCenterTreeContainerComponent, canActivate: [AuthPageGuard], data: { pageName: 'CostCenter' } },
      { path: 'new-entry-template', component: CreateJournalEntryTemplateComponent, canActivate: [AuthPageGuard], data: { pageName: 'new-entry-template' } },
      { path: 'journal-entry-templates', component: JournalEntryTemplatesComponent, canActivate: [AuthPageGuard], data: { pageName: 'journal-entry-templates' } },
      { path: 'new-entry', component: CreateJournalEntryComponent, canActivate: [AuthPageGuard], data: { pageName: 'new-entry' } },
      { path: 'journal-daily-list', component: JournalDailyListComponent, canActivate: [AuthPageGuard], data: { pageName: 'journal-daily-list' } },
      { path: 'create-payment-order', component: CreatePaymentOrderComponent, canActivate: [AuthPageGuard], data: { pageName: 'create-payment-order' } },
      { path: 'create-payment-receipt', component: CreatePaymentReceiptComponent, canActivate: [AuthPageGuard], data: { pageName: 'create-payment-receipt' } },
      { path: 'create-receive-receipt', component: CreateReceiveReceiptComponent, canActivate: [AuthPageGuard], data: { pageName: 'create-receive-receipt' } },
      { path: 'payment-receipts', component: PaymentReceiptsComponent, canActivate: [AuthPageGuard], data: { pageName: 'payment-receipts' } },
      { path: 'payment-orders', component: PaymentOrdersComponent, canActivate: [AuthPageGuard], data: { pageName: 'payment-orders' } },
      { path: 'receive-receipts', component: ReceiveReceiptsComponent, canActivate: [AuthPageGuard], data: { pageName: 'receive-receipts' } },
      { path: 'accounts-general-ledger', component: AccountsGeneralLedgerComponent, canActivate: [AuthPageGuard], data: { pageName: 'accounts-general-ledger' } },
      { path: 'accounts-assistant-ledger', component: AccountsAssistantLedgerComponent, canActivate: [AuthPageGuard], data: { pageName: 'accounts-assistant-ledger' } },
      { path: 'monthly-assistant-ledger', component: MonthlyAssistantLedgerComponent, canActivate: [AuthPageGuard], data: { pageName: 'monthly-assistant-ledger' } },
      { path: 'trial-balance', component: TrialBalanceComponent, canActivate: [AuthPageGuard], data: { pageName: 'trial-balance' } },
      { path: 'balance-sheet', component: BalanceSheetComponent, canActivate: [AuthPageGuard], data: { pageName: 'balance-sheet' } },
      { path: 'cost-general-ledger', component: CostGeneralLedgerComponent, canActivate: [AuthPageGuard], data: { pageName: 'cost-general-ledger' } },
      { path: 'cost-assistant-ledger', component: CostAssistantLedgerComponent, canActivate: [AuthPageGuard], data: { pageName: 'cost-assistant-ledger' } },
      { path: 'cost-trial-balance', component: CostTrialBalanceComponent, canActivate: [AuthPageGuard], data: { pageName: 'cost-trial-balance' } },
      { path: 'cost-center-matrix', component: CostCenterMatrixComponent, canActivate: [AuthPageGuard], data: { pageName: 'cost-center-matrix' } },
      { path: 'journal-entry-types', component: JournalEntryTypesComponent, canActivate: [AuthPageGuard], data: { pageName: 'journal-entry-types' } },
      { path: 'receipt-ledgers', component: ReceiptLedgersComponent, canActivate: [AuthPageGuard], data: { pageName: 'receipt-ledgers' } },
      { path: 'financial-period', component: FinancialPeriodsComponent, canActivate: [AuthPageGuard], data: { pageName: 'financial-period' } },
      { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthPageGuard], data: { pageName: 'opening-balance' } },
      { path: 'payment-terms', component: PaymentTermComponent, canActivate: [AuthPageGuard], data: { pageName: 'payment-terms' } },
      { path: 'tax-calculation', component: TaxCalculationComponent, canActivate: [AuthPageGuard], data: { pageName: 'tax-calculation' } },
      { path: 'daily-notebook', component: DailyNotebookComponent, canActivate: [AuthPageGuard], data: { pageName: 'daily-notebook' } },
      { path: 'assets-form', component: AssetsFormComponent, canActivate: [AuthPageGuard], data: { pageName: 'assets-form' } },
      // { path: 'loans', component: LoansComponent },
      { path: 'ledger-journal-types', component: LedgerJournalTypeComponent, canActivate: [AuthPageGuard], data: { pageName: 'ledger-journal-types' } },
      { path: 'customers', component: CustomersComponent, canActivate: [AuthPageGuard], data: { pageName: 'customers' } },
      { path: 'batches', component: BatchesComponent, canActivate: [AuthPageGuard], data: { pageName: 'batches' } },
      { path: 'loans-requests', component: LoansRequestsComponent, canActivate: [AuthPageGuard], data: { pageName: 'loans-requests' } },
      { path: 'advances-requests', component: AdvancesRequestsComponent, canActivate: [AuthPageGuard], data: { pageName: 'advances-requests' } },
      { path: 'monthly-salaries', component: MonthlySalariesComponent, canActivate: [AuthPageGuard], data: { pageName: 'monthly-salaries' } },
      { path: 'dues-requests', component: DuesRequestsComponent, canActivate: [AuthPageGuard], data: { pageName: 'dues-requests' } },
      { path: 'indebtedness-report', component: IndebtednessPdfReportComponent, canActivate: [AuthPageGuard], data: { pageName: 'indebtedness-report' } },
      { path: 'banks', component: BanksComponent, 
        // canActivate: [AuthPageGuard], 
        data: { pageName: 'banks' } },
      { path: '', redirectTo: 'home', pathMatch: 'full' },


    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAccountsRoutingModule { }
