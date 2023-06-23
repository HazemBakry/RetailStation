import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from './BasicInformation/currency/currency.component';
import { FeaturedComponent } from './BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './BasicInformation/receipt-books/receipt-books.component';
import { AccountTreeComponent } from './GeneralAccounts/components/account-tree/account-tree.component';

const routes: Routes = [
  {path:'currency',component:CurrencyComponent},
  {path:'featured',component:FeaturedComponent},
  {path:'fiscalYear',component:FiscalYearComponent},
  {path:'receiptBooks',component:ReceiptBooksComponent},
  {path:'accountTree',component:AccountTreeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAccountRoutingModule { }
