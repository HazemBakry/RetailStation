import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErpLoginComponent } from './erp-login/erp-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'Erp', pathMatch: 'full' },
  { path: 'Login', component: ErpLoginComponent },
  { path: 'Erp', loadChildren: () => import('./erp-admin/erp-admin.module').then(erp => erp.ErpAdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
