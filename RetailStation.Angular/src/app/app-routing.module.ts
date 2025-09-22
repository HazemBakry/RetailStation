import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/Shared/components/dashboard/dashboard.component';
import { NotAuthorizedComponent } from './components/Shared/components/not-authorized/not-authorized.component';
import { AuthGuard } from './Auth/auth.guard';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { ErpHomeComponent } from './components/Shared/components/erp-home/erp-home.component';
import { AuthPageGuard } from './Auth/authPage.guard';
import { LoginComponent } from './Auth/login/login.component';
import { RetailHomeComponent } from './components/Shared/components/retail-home/retail-home.component';
import { RegisterComponent } from './Auth/register/register.component';
import { WebsiteComponent } from './components/Main/components/website/website.component';
import { WebsiteHomeComponent } from './components/Main/components/website/website-home/website-home.component';
import { WebsiteSubscribeComponent } from './components/Main/components/website/website-subscribe/website-subscribe.component';
import { WebsiteCartComponent } from './components/Main/components/website/website-cart/website-cart.component';

const routes: Routes = [
  // { path: '', component: RetailHomeComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    // data: { roles: ['SuperAdmin'] },
    component: WebsiteComponent,
    children: [
      { path: '', component: WebsiteHomeComponent },
      { path: 'subscribe', component: WebsiteSubscribeComponent },
      { path: 'cart', component: WebsiteCartComponent },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    loadChildren: () =>
      import('./components/Main/main.module').then((erp) => erp.MainModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/Admin/admin.module').then((erp) => erp.AdminModule),
  },
  {
    path: 'design',
    loadChildren: () =>
      import('./components/Design/design.module').then(
        (erp) => erp.DesignModule
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
  // { path: 'profile', loadChildren: () => import('./components/EmployeeProfile/employee-profile.module').then(erp => erp.EmployeeProfileModule), canActivate: [AuthGuard] },
  // { path: 'auth-callback', component: AuthCallbackComponent },
  // { path: 'unauthorized', component: NotAuthorizedComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'hr', loadChildren: () => import('./components/HR/hr.module').then(erp => erp.HrModule), canActivate: [AuthPageGuard], data: { pageName: 'HR' }},
  // { path: 'purchases', loadChildren: () => import('./components/Purchases/purchases.module').then(erp => erp.PurchasesModule), canActivate: [AuthPageGuard], data: { pageName: 'Purchases' } },
  // { path: 'sales', loadChildren: () => import('./components/Sales/sales.module').then(erp => erp.SalesModule), canActivate: [AuthGuard] },
  // { path: 'general-accounts', loadChildren: () => import('./components/GeneralAccounts/general-accounts.module').then(erp => erp.GeneralAccountsModule), canActivate: [AuthPageGuard], data: { pageName: 'GeneralAccounts'} },
  // { path: 'inventory', loadChildren: () => import('./components/Inventory/inventory.module').then(erp => erp.InventoryModule), canActivate: [AuthPageGuard] , data: { pageName: 'Inventory'}},
  // { path: 'system-settings', loadChildren: () => import('./components/SystemSettings/system-settings.module').then(erp => erp.SystemSettingsModule), canActivate: [AuthGuard] },
  // { path: 'create-report', loadChildren: () => import('./components/Reports/reports.module').then(erp => erp.ReportsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
