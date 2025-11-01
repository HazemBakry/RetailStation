import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageSubscriptionsComponent } from './components/ManageSubscriptions/manage-subscriptions.component';
import { AddSubscriberComponent } from './components/ManageSubscriptions/add-subscriber/add-subscriber.component';
import { SubscriberUsersComponent } from './components/ManageSubscriptions/manage-users/subscriber-users.component';
import { SubscriberApplicationsComponent } from './components/ManageSubscriptions/subscriber-applications/subscriber-applications.component';
import { SubscriberBranchesComponent } from './components/ManageSubscriptions/subscriber-branches/subscriber-branches.component';
import { SubscriberProfileComponent } from './components/ManageSubscriptions/subscriber-profile/subscriber-profile.component';
import { SubscribersComponent } from './components/ManageSubscriptions/subscribers/subscribers.component';
import { RolesComponent } from './components/ManageSubscriptions/roles/roles.component';
import { ManageRolePagesComponent } from './components/ManageSubscriptions/manage-role-pages/manage-role-pages.component';
import { PermissionItemComponent } from './components/ManageSubscriptions/permission-item/permission-item.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SocialMediaPixelsComponent } from './components/social-media-pixels/social-media-pixels.component';
import { NotificationManagerComponent } from './components/notification-manager/notification-manager.component';
import { TagsManagerComponent } from './components/tags-manager/tags-manager.component';
import { SlidersComponent } from './components/sliders/sliders.component';
import { WebsiteAdminComponent } from './components/website-admin.component';
import { ManageSupplierItemsComponent } from './components/suppliers-container/manage-supplier-items/manage-supplier-items.component';
import { SuppliersContainerComponent } from './components/suppliers-container/suppliers-container.component';
import { SuppliersComponent } from './components/suppliers-container/suppliers/suppliers.component';
import { MerchantRequestsComponent } from './components/ManageSubscriptions/merchant-requests/merchant-requests.component';
import { ItemsCategoriesComponent } from './components/items-categories/items-categories.component';
import { ItemUnitsComponent } from './components/item-units/item-units.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    ManageSubscriptionsComponent,
    SubscriberApplicationsComponent,
    SubscriberUsersComponent,
    SubscribersComponent,
    RolesComponent,
    PermissionItemComponent,
    ManageRolePagesComponent,
    SubscriberProfileComponent,
    AddSubscriberComponent,
    SubscriberBranchesComponent,
    MerchantRequestsComponent,
    SuppliersContainerComponent,
    ManageSupplierItemsComponent,
    SuppliersComponent,
    WebsiteAdminComponent,
    SlidersComponent,
    SocialMediaPixelsComponent,
    NotificationManagerComponent,
    TagsManagerComponent,
    ItemsCategoriesComponent,
    ItemUnitsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
