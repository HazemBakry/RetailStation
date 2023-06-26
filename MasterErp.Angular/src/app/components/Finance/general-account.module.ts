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


@NgModule({
  declarations: [
    CurrencyComponent,
    FeaturedComponent,
    FiscalYearComponent,
    ReceiptBooksComponent,
    AccountTreeComponent,
    CostCenterTreeComponent
    
  ],
  imports: [
    CommonModule,
    GeneralAccountRoutingModule,
    SharedModule
  ]
})
export class GeneralAccountModule { }
