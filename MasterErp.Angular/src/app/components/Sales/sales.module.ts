import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { SharedModule } from '../Shared/shared.module';
import { SalesInvoicesComponent } from './components/sales-invoices/sales-invoices.component';
import { AddSalesInvoiceComponent } from './components/add-sales-invoice/add-sales-invoice.component';


@NgModule({
  declarations: [
    SalesLayoutComponent,
    SalesInvoicesComponent,
    AddSalesInvoiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SalesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SalesModule { }
