import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserHomeComponent } from './components/user-home/user-home.component';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: UserHomeComponent },
      { path: 'home', component: UserHomeComponent },
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
