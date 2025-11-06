import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Auth/auth.guard';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/Website/website.module').then((x) => x.WebsiteModule)
  },
  //{ path: 'panel-home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //{ path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'website',
    loadChildren: () =>
      import('./components/Website/website.module').then((x) => x.WebsiteModule)
  },
  {
    path: 'user-panel',
    loadChildren: () =>
      import('./components/UserPanel/user.module').then((x) => x.UserModule),
    canActivate: [AuthGuard],
    data: { roles: ['User'] },
  },
  {
    path: 'merchant',
    loadChildren: () =>
      import('./components/Merchant/merchant.module').then((e) => e.MerchantModule),
    canActivate: [AuthGuard],
    data: { roles: ['Merchant'] },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/Admin/admin.module').then((e) => e.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin'] },
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
