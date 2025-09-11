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
import { SuppliersComponent } from './components/Operation/suppliers/suppliers.component';
import { ItemsComponent } from './components/Operation/items/items.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    ManageSubscriptionsComponent,
    SubscriberApplicationsComponent,
    SubscriberUsersComponent,
    SubscribersComponent,
    SubscriberProfileComponent,
    AddSubscriberComponent,
    SubscriberBranchesComponent,
    ItemsCategoriesComponent,
    ItemUnitsComponent,
    SuppliersComponent,
    ItemsComponent
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
