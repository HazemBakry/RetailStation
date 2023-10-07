import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: ErpLoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'Hr', loadChildren: () => import('./components/HR/hr.module').then(erp => erp.HrModule) },
  { path: 'Finance', loadChildren: () => import('./components/Finance/finance.module').then(erp => erp.FinanceModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
