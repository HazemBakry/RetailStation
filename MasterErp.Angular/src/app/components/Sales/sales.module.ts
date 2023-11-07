import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddSalesComponent } from './components/add-sales/add-sales.component';
import { SalesInvoiceComponent } from './components/sales-invoice/sales-invoice.component';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { SharedModule } from '../Shared/shared.module';


@NgModule({
  declarations: [
    SalesLayoutComponent,
    SalesInvoiceComponent,
    AddSalesComponent
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
