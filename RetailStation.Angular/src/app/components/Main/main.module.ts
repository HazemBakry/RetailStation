import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { MerchantInvoicesComponent } from './components/merchant/merchant-invoices/merchant-invoices.component';
import { MerchantOrdersComponent } from './components/merchant/merchant-orders/merchant-orders.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    MainHomeComponent,
    // SupplierItemsComponent,
    MerchantOrdersComponent,
    MerchantInvoicesComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
