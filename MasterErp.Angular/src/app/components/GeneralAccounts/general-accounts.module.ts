import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAccountsRoutingModule } from './general-accounts-routing.module';
import { AccountsAssistantLedgerComponent } from './components/accounts-assistant-ledger/accounts-assistant-ledger.component';
import { AccountsGeneralLedgerComponent } from './components/accounts-general-ledger/accounts-general-ledger.component';
import { CostAssistantLedgerComponent } from './components/cost-assistant-ledger/cost-assistant-ledger.component';
import { CostCenterMatrixComponent } from './components/cost-center-matrix/cost-center-matrix.component';
import { CostGeneralLedgerComponent } from './components/cost-general-ledger/cost-general-ledger.component';
import { CostTrialBalanceComponent } from './components/cost-trial-balance/cost-trial-balance.component';
import { CreatePaymentReceiptComponent } from './components/create-payment-receipt/create-payment-receipt.component';
import { CreateReceiveReceiptComponent } from './components/create-receive-receipt/create-receive-receipt.component';
import { JournalDailyListComponent } from './components/journal-daily-list/journal-daily-list.component';
import { MonthlyAssistantLedgerComponent } from './components/monthly-assistant-ledger/monthly-assistant-ledger.component';
import { PaymentReceiptsComponent } from './components/payment-receipts/payment-receipts.component';
import { ReceiveReceiptsComponent } from './components/receive-receipts/receive-receipts.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { GeneralAccountsLayoutComponent } from './general-accounts-layout/general-accounts-layout.component';
import { ReceiptLedgersComponent } from './components/receipt-ledgers/receipt-ledgers.component';
import { FinancialPeriodsComponent } from './components/financial-periods/financial-periods.component';
import { JournalEntryTypesComponent } from './components/journal-entry-types/journal-entry-types.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { AccountTreeContainerComponent } from './components/account-tree-container/account-tree-container.component';
import { CostCenterTreeContainerComponent } from './components/cost-center-tree-container/cost-center-tree-container.component';
import { CostCenterTreeComponent } from './components/cost-center-tree-container/cost-center-tree/cost-center-tree.component';
import { AddEditCostCenterTreeComponent } from './components/cost-center-tree-container/add-edit-cost-center-tree/add-edit-cost-center-tree.component';
import { CostCenterTreeItemComponent } from './components/cost-center-tree-container/cost-center-tree-item/cost-center-tree-item.component';
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
import { GeneralAccountsDashboardComponent } from './components/general-accounts-dashboard/general-accounts-dashboard.component';
import { AdvancesRequestsComponent } from './components/advances-requests/advances-requests.component';
import { IndebtednessPdfReportComponent } from './components/indebtedness-pdf-report/indebtedness-pdf-report.component';


@NgModule({
  declarations: [
    GeneralAccountsLayoutComponent,
    CostCenterTreeComponent,
    JournalDailyListComponent,
    CreateReceiveReceiptComponent,
    CreatePaymentOrderComponent,
    CreatePaymentReceiptComponent,
    PaymentReceiptsComponent,
    PaymentOrdersComponent,
    ReceiveReceiptsComponent,
    AccountsGeneralLedgerComponent,
    MonthlyAssistantLedgerComponent,
    TrialBalanceComponent,
    AccountsAssistantLedgerComponent,
    CostGeneralLedgerComponent,
    CostAssistantLedgerComponent,
    CostTrialBalanceComponent,
    CostCenterMatrixComponent,
    ReceiptLedgersComponent,
    FinancialPeriodsComponent,
    JournalEntryTypesComponent,
    OpeningBalanceComponent,
    AccountTreeContainerComponent,
    AddEditCostCenterTreeComponent,
    CostCenterTreeItemComponent,
    CostCenterTreeContainerComponent,
    GeneralAccountsHomeComponent,
    PaymentTermComponent,
    TaxCalculationComponent,
    DailyNotebookComponent,
    AssetsFormComponent,
    LoansComponent,
    LedgerJournalTypeComponent,
    CustomersComponent,
    BatchesComponent,
    CreateJournalEntryComponent,
    BalanceSheetComponent,
    CreateJournalEntryTemplateComponent,
    JournalEntryTemplatesComponent,
    LoansRequestsComponent,
    GeneralAccountsDashboardComponent,
    AdvancesRequestsComponent,
    IndebtednessPdfReportComponent
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
