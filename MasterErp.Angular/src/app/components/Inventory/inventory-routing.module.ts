import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReceiveOrderComponent } from './components/create-receive-order/create-receive-order.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';
import { RawItemsComponent } from './components/raw-items/raw-items.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { CreatePurchasesRequestComponent } from './components/create-purchases-request/create-purchases-request.component';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryLayoutComponent,
    children: [
      { path: 'receive-orders', component: ReceivedOrdersComponent },
      { path: 'new-receive-orders', component: CreateReceiveOrderComponent },
      { path: 'raw-items', component: RawItemsComponent },
      { path: 'purchases-requests', component: PurchasesRequestsComponent },
      { path: 'add-purchases-request', component: CreatePurchasesRequestComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
