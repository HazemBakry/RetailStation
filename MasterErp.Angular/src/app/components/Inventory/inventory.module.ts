import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CreateReceiveOrderComponent } from './components/create-receive-order/create-receive-order.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';
import { InventoryLayoutComponent } from './inventory-layout.component';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { OrderSearchSidepanelComponent } from './components/order-search-sidepanel/order-search-sidepanel.component';


@NgModule({
  declarations: [
    InventoryLayoutComponent,
    CreateReceiveOrderComponent,
    ReceivedOrdersComponent,
    OrderSearchSidepanelComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule
  ]
})
export class InventoryModule { }
