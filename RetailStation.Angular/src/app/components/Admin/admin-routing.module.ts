import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AuthGuard } from 'src/app/Auth/auth.guard';
import { SubscriberApplicationsComponent } from './components/ManageSubscriptions/subscriber-applications/subscriber-applications.component';
import { AddSubscriberComponent } from './components/ManageSubscriptions/add-subscriber/add-subscriber.component';
import { SubscriberUsersComponent } from './components/ManageSubscriptions/manage-users/subscriber-users.component';
import { SubscriberBranchesComponent } from './components/ManageSubscriptions/subscriber-branches/subscriber-branches.component';
import { SubscriberProfileComponent } from './components/ManageSubscriptions/subscriber-profile/subscriber-profile.component';
import { SubscribersComponent } from './components/ManageSubscriptions/subscribers/subscribers.component';
import { ManageSubscriptionsComponent } from './components/ManageSubscriptions/manage-subscriptions.component';
import { ItemsCategoriesComponent } from './components/Operation/items-categories/items-categories.component';
import { ItemUnitsComponent } from './components/Operation/item-units/item-units.component';
import { SuppliersComponent } from './components/Operation/suppliers/suppliers.component';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { ItemsComponent } from './components/Operation/items/items.component';
import { RolesComponent } from './components/ManageSubscriptions/roles/roles.component';
import { ManageRolePagesComponent } from './components/ManageSubscriptions/manage-role-pages/manage-role-pages.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'home/:tabName', component: AdminHomeComponent },
      { path: 'items-categories', component: ItemsCategoriesComponent },
      { path: 'items-units', component: ItemUnitsComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'items', component: ItemsComponent, },//canActivate: [AuthPageGuard], data: { pageName: 'Items' } },

      {
        path: 'manage-subscriptions',
        canActivate: [AuthGuard],
        data: { roles: ['SuperAdmin'] },
        component: ManageSubscriptionsComponent,
        children: [
          { path: 'subscribers', component: SubscribersComponent },
          { path: 'add-subscriber', component: AddSubscriberComponent },
          {
            path: 'subscriber-profile/:SubscriberId',
            component: SubscriberProfileComponent,
            children: [
              { path: 'subscriber-info', component: AddSubscriberComponent },
              { path: 'subscriber-applications', component: SubscriberApplicationsComponent },
              { path: 'subscriber-users', component: SubscriberUsersComponent },
              { path: 'subscriber-branches', component: SubscriberBranchesComponent },
              { path: '', redirectTo: 'subscriber-info', pathMatch: 'full' },
            ],
          },
          { path: '', redirectTo: 'subscribers', pathMatch: 'full' },
        ],
      },
      { path: 'roles', component: RolesComponent },
      { path: 'manage-role-pages/:roleId', component: ManageRolePagesComponent },


      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
