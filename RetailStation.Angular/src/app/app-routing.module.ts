import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { ReviewsComponent } from './components/Main/reviews/reviews.component';
import { NotAuthorizedComponent } from './components/Shared/components/not-authorized/not-authorized.component';
import { AuthGuard } from './Auth/auth.guard';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { ErpHomeComponent } from './components/Shared/components/erp-home/erp-home.component';
import { AuthPageGuard } from './Auth/authPage.guard';

const routes: Routes = [
  { path: '', component: ErpHomeComponent},
  { path: 'profile', loadChildren: () => import('./components/EmployeeProfile/employee-profile.module').then(erp => erp.EmployeeProfileModule), canActivate: [AuthGuard] },
  //{ path: 'login', component: ErpLoginComponent, canActivate: [AuthGuard] },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'unauthorized', component: NotAuthorizedComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'hr', loadChildren: () => import('./components/HR/hr.module').then(erp => erp.HrModule), canActivate: [AuthPageGuard], data: { pageName: 'HR' }},
  { path: 'purchases', loadChildren: () => import('./components/Purchases/purchases.module').then(erp => erp.PurchasesModule), canActivate: [AuthPageGuard], data: { pageName: 'Purchases' } },
  { path: 'sales', loadChildren: () => import('./components/Sales/sales.module').then(erp => erp.SalesModule), canActivate: [AuthGuard] },
  { path: 'general-accounts', loadChildren: () => import('./components/GeneralAccounts/general-accounts.module').then(erp => erp.GeneralAccountsModule), canActivate: [AuthPageGuard], data: { pageName: 'GeneralAccounts'} },
  { path: 'inventory', loadChildren: () => import('./components/Inventory/inventory.module').then(erp => erp.InventoryModule), canActivate: [AuthPageGuard] , data: { pageName: 'Inventory'}},
  { path: 'system-settings', loadChildren: () => import('./components/SystemSettings/system-settings.module').then(erp => erp.SystemSettingsModule), canActivate: [AuthGuard] },
  { path: 'design', loadChildren: () => import('./components/Design/design.module').then(erp => erp.DesignModule), canActivate: [AuthGuard] },
  { path: 'create-report', loadChildren: () => import('./components/Reports/reports.module').then(erp => erp.ReportsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
