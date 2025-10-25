import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthGuard } from 'src/app/Auth/auth.guard';
import { SubscriberApplicationsComponent } from './components/ManageSubscriptions/subscriber-applications/subscriber-applications.component';
import { AddSubscriberComponent } from './components/ManageSubscriptions/add-subscriber/add-subscriber.component';
import { SubscriberUsersComponent } from './components/ManageSubscriptions/manage-users/subscriber-users.component';
import { SubscriberBranchesComponent } from './components/ManageSubscriptions/subscriber-branches/subscriber-branches.component';
import { SubscriberProfileComponent } from './components/ManageSubscriptions/subscriber-profile/subscriber-profile.component';
import { SubscribersComponent } from './components/ManageSubscriptions/subscribers/subscribers.component';
import { ManageSubscriptionsComponent } from './components/ManageSubscriptions/manage-subscriptions.component';
import { RolesComponent } from './components/ManageSubscriptions/roles/roles.component';
import { ManageRolePagesComponent } from './components/ManageSubscriptions/manage-role-pages/manage-role-pages.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SlidersComponent } from './components/sliders/sliders.component';
import { SuppliersContainerComponent } from './components/suppliers-container/suppliers-container.component';
import { SuppliersComponent } from './components/suppliers-container/suppliers/suppliers.component';
import { ManageSupplierItemsComponent } from './components/suppliers-container/manage-supplier-items/manage-supplier-items.component';
import { SubscriptionRequestsComponent } from './components/ManageSubscriptions/subscription-requests/subscription-requests.component';
import { ItemsCategoriesComponent } from './components/items-categories/items-categories.component';
import { ItemUnitsComponent } from './components/item-units/item-units.component';
import { SocialMediaPixelsComponent } from './components/social-media-pixels/social-media-pixels.component';
import { NotificationManagerComponent } from './components/notification-manager/notification-manager.component';
import { TagsManagerComponent } from './components/tags-manager/tags-manager.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'home', component: AdminDashboardComponent },
      { path: 'home/:tabName', component: AdminDashboardComponent },
      {
        path: 'suppliers',
        canActivate: [AuthGuard],
        data: { roles: ['SuperAdmin'] },
        component: SuppliersContainerComponent,
        children: [
          { path: '', component: SuppliersComponent },
          { path: 'add-subscriber', component: AddSubscriberComponent },
          { path: 'manage-supplier-items/:SupplierId', component: ManageSupplierItemsComponent }
        ],
      },
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
      { path: 'items-categories', component: ItemsCategoriesComponent },
      { path: 'items-units', component: ItemUnitsComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'manage-role-pages/:roleId', component: ManageRolePagesComponent },
      { path: 'subscription-requests', component: SubscriptionRequestsComponent },
      { path: 'sliders', component: SlidersComponent },
      { path: 'social-media', component: SocialMediaPixelsComponent },
      { path: 'notifications-manager', component: NotificationManagerComponent },
      { path: 'tags-manager', component: TagsManagerComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
