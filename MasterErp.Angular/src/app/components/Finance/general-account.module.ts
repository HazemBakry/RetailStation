import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAccountRoutingModule } from './general-account-routing.module';
import { CurrencyComponent } from './BasicInformation/currency/currency.component';
import { FeaturedComponent } from './BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './BasicInformation/receipt-books/receipt-books.component';


@NgModule({
  declarations: [
    CurrencyComponent,
    FeaturedComponent,
    FiscalYearComponent,
    ReceiptBooksComponent
  ],
  imports: [
    CommonModule,
    GeneralAccountRoutingModule
  ]
})
export class GeneralAccountModule { }
