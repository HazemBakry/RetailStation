import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAccountsRoutingModule } from './general-accounts-routing.module';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { AccountsAssistantLedgerComponent } from './components/accounts-assistant-ledger/accounts-assistant-ledger.component';
import { AccountsGeneralLedgerComponent } from './components/accounts-general-ledger/accounts-general-ledger.component';
import { CostAssistantLedgerComponent } from './components/cost-assistant-ledger/cost-assistant-ledger.component';
import { CostCenterMatrixComponent } from './components/cost-center-matrix/cost-center-matrix.component';
import { CostCenterTreeComponent } from './components/cost-center-tree/cost-center-tree.component';
import { CostGeneralLedgerComponent } from './components/cost-general-ledger/cost-general-ledger.component';
import { CostTrialBalanceComponent } from './components/cost-trial-balance/cost-trial-balance.component';
import { CreatePaymentReceiptComponent } from './components/create-payment-receipt/create-payment-receipt.component';
import { CreateReceiveReceiptComponent } from './components/create-receive-receipt/create-receive-receipt.component';
import { JournalDailyListComponent } from './components/journal-daily-list/journal-daily-list.component';
import { MonthlyAssistantLedgerComponent } from './components/monthly-assistant-ledger/monthly-assistant-ledger.component';
import { NewEntryComponent } from './components/new-entry/new-entry.component';
import { PaymentReceiptsComponent } from './components/payment-receipts/payment-receipts.component';
import { ReceiveReceiptsComponent } from './components/receive-receipts/receive-receipts.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { GeneralAccountsLayoutComponent } from './general-accounts-layout/general-accounts-layout.component';


@NgModule({
  declarations: [
    GeneralAccountsLayoutComponent,
    AccountTreeComponent,
    CostCenterTreeComponent,
    NewEntryComponent,
    JournalDailyListComponent,
    CreateReceiveReceiptComponent,
    CreatePaymentReceiptComponent,
    PaymentReceiptsComponent,
    ReceiveReceiptsComponent,
    AccountsGeneralLedgerComponent,
    MonthlyAssistantLedgerComponent,
    TrialBalanceComponent,
    AccountsAssistantLedgerComponent,
    CostGeneralLedgerComponent,
    CostAssistantLedgerComponent,
    CostTrialBalanceComponent,
    CostCenterMatrixComponent
  ],
  imports: [
    CommonModule,
    GeneralAccountsRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class GeneralAccountsModule { }
