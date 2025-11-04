import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { SharedModule } from '../Shared/shared.module';
import { AddSalesInvoiceComponent } from './components/add-sales-invoice/add-sales-invoice.component';
import { SalesDashboardComponent } from './components/sales-dashboard/sales-dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ItemsComponent } from './components/items/items.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { SalesReturnsComponent } from './components/sales-returns/sales-returns.component';
import { AddSalesReturnsComponent } from './components/add-sales-returns/add-sales-returns.component';
import { CustomersStatementComponent } from './components/customers-statement/customers-statement.component';
import { MySuppliersComponent } from './components/my-suppliers/my-suppliers.component';
import { MerchantItemsComponent } from '../Main/components/merchant/merchant-items/merchant-items.component';
import { MerchantProfileComponent } from './components/merchant-profile/merchant-profile.component';


@NgModule({
  declarations: [
    SalesLayoutComponent,
    AddSalesInvoiceComponent,
    SalesDashboardComponent,
    OrdersComponent,
    ItemsComponent,
    MerchantItemsComponent,
    PromotionsComponent,
    SalesReturnsComponent,
    AddSalesReturnsComponent,
    CustomersStatementComponent,
    MySuppliersComponent,
    MerchantProfileComponent
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
