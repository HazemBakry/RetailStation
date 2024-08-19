import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CreateReceiveOrderComponent } from './components/create-receive-order/create-receive-order.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderSearchSidepanelComponent } from './components/order-search-sidepanel/order-search-sidepanel.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { CreatePurchasesRequestComponent } from './components/create-purchases-request/create-purchases-request.component';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { UnitsComponent } from './components/units/units.component';
import { ItemsComponent } from './components/items/items.component';


@NgModule({
  declarations: [
    InventoryLayoutComponent,
    CreateReceiveOrderComponent,
    ReceivedOrdersComponent,
    OrderSearchSidepanelComponent,
    ItemsComponent,
    ItemsCategoryComponent,
    CreatePurchasesRequestComponent,
    PurchasesRequestsComponent,
    AddItemComponent,
    InventoryHomeComponent,
    UnitsComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class InventoryModule { }
