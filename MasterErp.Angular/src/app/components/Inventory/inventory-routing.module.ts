import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesLayoutComponent } from '../Finance/Purchase/purchases-layout.component';
import { CreateReceiveOrderComponent } from './components/create-receive-order/create-receive-order.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';
import { RawItemsComponent } from './components/raw-items/raw-items.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesLayoutComponent,
    children: [
      { path: 'receive-orders', component: ReceivedOrdersComponent },
      { path: 'new-receive-orders', component: CreateReceiveOrderComponent },
      { path: 'raw-items', component: RawItemsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
