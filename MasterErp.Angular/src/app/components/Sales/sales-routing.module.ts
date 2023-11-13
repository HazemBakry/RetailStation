import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { SalesInvoiceComponent } from './components/sales-invoice/sales-invoice.component';
import { AddSalesComponent } from './components/add-sales/add-sales.component';


const routes: Routes = [
  {
    path: '',
    component: SalesLayoutComponent,
    children: [
      { path: 'sales-invoices', component: SalesInvoiceComponent },
      { path: 'add-sales-invoice', component: AddSalesComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
