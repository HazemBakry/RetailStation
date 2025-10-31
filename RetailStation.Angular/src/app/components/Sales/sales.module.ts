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
import { SupplierItemsComponent } from '../Main/components/supplier/supplier-items/supplier-items.component';


@NgModule({
  declarations: [
    SalesLayoutComponent,
    AddSalesInvoiceComponent,
    SalesDashboardComponent,
    OrdersComponent,
    ItemsComponent,
    SupplierItemsComponent,
    PromotionsComponent,
    SalesReturnsComponent,
    AddSalesReturnsComponent,
    CustomersStatementComponent,
    MySuppliersComponent
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
