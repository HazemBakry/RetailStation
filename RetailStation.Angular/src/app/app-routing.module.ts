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
  // {
  //   path: 'user-panel',
  //   loadChildren: () =>
  //     import('./components/UserPanel/user.module').then((x) => x.UserModule),
  //   canActivate: [AuthGuard],
  //   data: { roles: ['User'] },
  // },
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
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
