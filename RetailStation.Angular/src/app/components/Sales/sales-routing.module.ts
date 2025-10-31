import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { SalesDashboardComponent } from './components/sales-dashboard/sales-dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ItemsComponent } from './components/items/items.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { SalesReturnsComponent } from './components/sales-returns/sales-returns.component';
import { AddSalesReturnsComponent } from './components/add-sales-returns/add-sales-returns.component';
import { CustomersStatementComponent } from './components/customers-statement/customers-statement.component';
import { MySuppliersComponent } from './components/my-suppliers/my-suppliers.component';
import { SupplierItemsComponent } from '../Main/components/supplier/supplier-items/supplier-items.component';



const routes: Routes = [
  {
    path: '',
    component: SalesLayoutComponent,
    children: [
      { path: 'dashboard', component: SalesDashboardComponent, canActivate: [AuthPageGuard], data: { pageName: 'SalesDashboard' } },
      // { path: 'home', component: SalesHomeComponent, canActivate: [AuthPageGuard], data: { pageName: 'SalesDashboard' } },
      // { path: 'home/:tabName', component: SalesHomeComponent },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthPageGuard], data: { pageName: 'Orders' } },
      { path: 'items', component: SupplierItemsComponent, },//canActivate: [AuthPageGuard], data: { pageName: 'Items' } },
      { path: 'promotions', component: PromotionsComponent, canActivate: [AuthPageGuard], data: { pageName: 'promotions' } },
      { path: 'sales-returns', component: SalesReturnsComponent, canActivate: [AuthPageGuard], data: { pageName: 'sales-returns' } },
      { path: 'add-sales-returns', component: AddSalesReturnsComponent, canActivate: [AuthPageGuard], data: { pageName: 'add-sales-returns' } },
      { path: 'customers-statement', component: CustomersStatementComponent, canActivate: [AuthPageGuard], data: { pageName: 'customers-statement' } },
      { path: 'my-suppliers', component: MySuppliersComponent, canActivate: [AuthPageGuard], data: { pageName: 'my-suppliers' } },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];








@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
