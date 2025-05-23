import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { CreateReportComponent } from './create-report/create-report.component';
import { JournalDailyReportComponent } from './journal-daily-report/journal-daily-report.component';
import { ArabicNumberPipe } from './Pipes/arabic-number.pipe';
import { PaymentReceiptsReportComponent } from './payment-receipts-report/payment-receipts-report.component';
import { EnglishNumberPipe } from './Pipes/english-number.pipe';


@NgModule({
  declarations: [
    CreateReportComponent,
    JournalDailyReportComponent,
    ArabicNumberPipe,
    PaymentReceiptsReportComponent,
    EnglishNumberPipe
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
