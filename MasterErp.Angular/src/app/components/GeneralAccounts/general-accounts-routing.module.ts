import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from '../Shared/components/BasicInformation/currency/currency.component';
import { FeaturedComponent } from '../Shared/components/BasicInformation/featured/featured.component';
import { FiscalYearComponent } from '../Shared/components/BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from '../Shared/components/BasicInformation/receipt-books/receipt-books.component';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { AccountsAssistantLedgerComponent } from './components/accounts-assistant-ledger/accounts-assistant-ledger.component';
import { AccountsGeneralLedgerComponent } from './components/accounts-general-ledger/accounts-general-ledger.component';
import { CostAssistantLedgerComponent } from './components/cost-assistant-ledger/cost-assistant-ledger.component';
import { CostCenterTreeComponent } from './components/cost-center-tree/cost-center-tree.component';
import { CostGeneralLedgerComponent } from './components/cost-general-ledger/cost-general-ledger.component';
import { CreatePaymentReceiptComponent } from './components/create-payment-receipt/create-payment-receipt.component';
import { CreateReceiveReceiptComponent } from './components/create-receive-receipt/create-receive-receipt.component';
import { JournalDailyListComponent } from './components/journal-daily-list/journal-daily-list.component';
import { MonthlyAssistantLedgerComponent } from './components/monthly-assistant-ledger/monthly-assistant-ledger.component';
import { NewEntryComponent } from './components/new-entry/new-entry.component';
import { PaymentReceiptsComponent } from './components/payment-receipts/payment-receipts.component';
import { ReceiveReceiptsComponent } from './components/receive-receipts/receive-receipts.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { GeneralAccountsLayoutComponent } from './general-accounts-layout/general-accounts-layout.component';
import { CostTrialBalanceComponent } from './components/cost-trial-balance/cost-trial-balance.component';
import { CostCenterMatrixComponent } from './components/cost-center-matrix/cost-center-matrix.component';
import { ReceiptLedgersComponent } from './components/receipt-ledgers/receipt-ledgers.component';
import { FinancialPeriodsComponent } from './components/financial-periods/financial-periods.component';
import { JournalEntryTypesComponent } from './components/journal-entry-types/journal-entry-types.component';
import { AccountTreeV2Component } from './components/account-tree-v2/account-tree-v2.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralAccountsLayoutComponent,
    children: [

      { path: 'currency', component: CurrencyComponent },
      { path: 'featured', component: FeaturedComponent },
      { path: 'fiscalYear', component: FiscalYearComponent },
      { path: 'receiptBooks', component: ReceiptBooksComponent },
      // { path: 'account-tree', component: AccountTreeComponent },
      { path: 'account-tree', component: AccountTreeV2Component },
      { path: 'cost-center-tree', component: CostCenterTreeComponent },
      { path: 'new-entry', component: NewEntryComponent },
      { path: 'journal-daily-list', component: JournalDailyListComponent },
      { path: 'create-payment-receipt', component: CreatePaymentReceiptComponent },
      { path: 'create-receive-receipt', component: CreateReceiveReceiptComponent },
      { path: 'payment-receipts', component: PaymentReceiptsComponent },
      { path: 'receive-receipts', component: ReceiveReceiptsComponent },
      { path: 'accounts-general-ledger', component: AccountsGeneralLedgerComponent },
      { path: 'accounts-assistant-ledger', component: AccountsAssistantLedgerComponent },
      { path: 'monthly-assistant-ledger', component: MonthlyAssistantLedgerComponent },
      { path: 'trial-balance', component: TrialBalanceComponent },
      { path: 'cost-general-ledger', component: CostGeneralLedgerComponent},
      { path: 'cost-assistant-ledger', component: CostAssistantLedgerComponent},
      { path: 'cost-trial-balance', component: CostTrialBalanceComponent},
      { path: 'cost-center-matrix', component: CostCenterMatrixComponent},
      { path: 'journal-entry-types', component: JournalEntryTypesComponent},
      { path: 'receipt-ledgers', component: ReceiptLedgersComponent},
      { path: 'financial-period', component: FinancialPeriodsComponent},
      
      
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAccountsRoutingModule { }
