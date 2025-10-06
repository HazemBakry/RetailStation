import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ManageSubscriptionsComponent } from './components/ManageSubscriptions/manage-subscriptions.component';
import { AddSubscriberComponent } from './components/ManageSubscriptions/add-subscriber/add-subscriber.component';
import { SubscriberUsersComponent } from './components/ManageSubscriptions/manage-users/subscriber-users.component';
import { SubscriberApplicationsComponent } from './components/ManageSubscriptions/subscriber-applications/subscriber-applications.component';
import { SubscriberBranchesComponent } from './components/ManageSubscriptions/subscriber-branches/subscriber-branches.component';
import { SubscriberProfileComponent } from './components/ManageSubscriptions/subscriber-profile/subscriber-profile.component';
import { SubscribersComponent } from './components/ManageSubscriptions/subscribers/subscribers.component';
import { ItemsCategoriesComponent } from './components/Operation/items-categories/items-categories.component';
import { ItemUnitsComponent } from './components/Operation/item-units/item-units.component';
import { SuppliersComponent } from './components/Operation/suppliers-container/suppliers/suppliers.component';
import { ItemsComponent } from './components/Operation/items/items.component';
import { RolesComponent } from './components/ManageSubscriptions/roles/roles.component';
import { ManageRolePagesComponent } from './components/ManageSubscriptions/manage-role-pages/manage-role-pages.component';
import { PermissionItemComponent } from './components/ManageSubscriptions/permission-item/permission-item.component';
import { WebsiteSubscribeRequestsComponent } from './components/ManageSubscriptions/website-subscribe-requests/website-subscribe-requests.component';
import { SuppliersContainerComponent } from './components/Operation/suppliers-container/suppliers-container.component';
import { ManageSupplierItemsComponent } from './components/Operation/suppliers-container/manage-supplier-items/manage-supplier-items.component';
import { WebsiteAdminComponent } from './components/website-admin/website-admin.component';
import { PromotionsComponent } from './components/website-admin/promotions/promotions.component';
import { SlidersComponent } from './components/website-admin/sliders/sliders.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
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
    ItemsCategoriesComponent,
    ItemUnitsComponent,
    SuppliersComponent,
    ItemsComponent,
    WebsiteSubscribeRequestsComponent,
    SuppliersContainerComponent,
    ManageSupplierItemsComponent,
    WebsiteAdminComponent,
    PromotionsComponent,
    SlidersComponent
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
