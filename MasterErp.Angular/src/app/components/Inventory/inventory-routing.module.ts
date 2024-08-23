import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { BusinessCoreLayoutComponent } from '../Shared/components/business-core-layout/business-core-layout.component';
import { UnitsComponent } from './components/units/units.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { AddReceiveOrderComponent } from './components/add-receive-order/add-receive-order.component';
import { AddPurchasesRequestComponent } from './components/add-purchase-request/add-purchases-request.component';
import { ReceiveOrdersComponent } from './components/receive-orders/receive-orders.component';
import { DeliveryOrdersComponent } from './components/delivery-orders/delivery-orders.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCoreLayoutComponent,
    children: [
      { path: 'home', component: InventoryHomeComponent },
      { path: 'receive-orders', component: ReceiveOrdersComponent },
      { path: 'deliver-orders', component: DeliveryOrdersComponent },
      { path: 'add-receive-order', component: AddReceiveOrderComponent },
      { path: 'add-item', component: AddItemComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'items-categories', component: ItemsCategoryComponent },
      { path: 'purchases-requests', component: PurchasesRequestsComponent },
      { path: 'add-purchases-request', component: AddPurchasesRequestComponent },
      { path: 'units', component: UnitsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule { }
