import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesLayoutComponent } from '../Finance/Purchase/purchases-layout.component';
import { CreateReceiveOrderComponent } from './components/create-receive-order/create-receive-order.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesLayoutComponent,
    children: [
      { path: 'receivedOrders', component: ReceivedOrdersComponent },
      { path: 'newReceiveOrders', component: CreateReceiveOrderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
