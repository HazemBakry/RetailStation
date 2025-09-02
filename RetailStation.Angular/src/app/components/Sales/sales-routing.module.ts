import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { SalesInvoicesComponent } from './components/sales-invoices/sales-invoices.component';
import { AddSalesInvoiceComponent } from './components/add-sales-invoice/add-sales-invoice.component';
import { SalesHomeComponent } from './components/sales-home/sales-home.component';


const routes: Routes = [
  {
    path: '',
    component: SalesLayoutComponent,
    children: [
      { path: 'home', component: SalesHomeComponent },
      { path: 'sales-invoices', component: SalesInvoicesComponent },
      { path: 'add-sales-invoice', component: AddSalesInvoiceComponent },
      { path: '', redirectTo: 'home' ,pathMatch: 'full' },

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
