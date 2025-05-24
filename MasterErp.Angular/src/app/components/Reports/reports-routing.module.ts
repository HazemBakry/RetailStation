import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReportComponent } from './create-report/create-report.component';
import { JournalDailyReportComponent } from './journal-daily-report/journal-daily-report.component';
import { PaymentReceiptsReportComponent } from './payment-receipts-report/payment-receipts-report.component';

const routes: Routes = [
  { path: 'generate-report/:companyName/:pageName/:controllerName/:apiName/:methodType/:sectionName', component: CreateReportComponent },
  { path: 'journal-daily-report/:controllerName/:apiName/:methodType', component: JournalDailyReportComponent },
  { path: 'payment-receipts-report/:controllerName/:apiName/:methodType', component: PaymentReceiptsReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
