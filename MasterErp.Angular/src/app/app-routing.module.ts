import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { ErpLoginComponent } from './erp-login/erp-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: ErpLoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'hr', loadChildren: () => import('./components/HR/hr-routing.module').then(erp => erp.HrRoutingModule) },
  { path: 'generalAccounts', loadChildren: () => import('./components/GeneralAccounts/general-account.module').then(erp => erp.GeneralAccountModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
