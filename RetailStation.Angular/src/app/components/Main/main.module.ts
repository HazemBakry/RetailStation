import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { WebsiteComponent } from './components/website/website.component';
import { WebsiteHomeComponent } from './components/website/website-home/website-home.component';
import { SupplierInvoicesComponent } from './components/supplier/supplier-invoices/supplier-invoices.component';
import { SupplierItemsComponent } from './components/supplier/supplier-items/supplier-items.component';
import { SupplierOrdersComponent } from './components/supplier/supplier-orders/supplier-orders.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    MainHomeComponent,
    SupplierItemsComponent,
    SupplierOrdersComponent,
    SupplierInvoicesComponent,
    WebsiteComponent,
    WebsiteHomeComponent
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
