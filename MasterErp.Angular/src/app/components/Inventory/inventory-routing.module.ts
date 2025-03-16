import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { UnitsComponent } from './components/units/units.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { AddReceiveOrderComponent } from './components/add-receive-order/add-receive-order.component';
import { ReceiveOrdersComponent } from './components/receive-orders/receive-orders.component';
import { DeliveryNotesComponent } from './components/delivery-notes/delivery-notes.component';
import { AddDeliveryNoteComponent } from './components/add-delivery-note/add-delivery-note.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { PurchaseReceiptsComponent } from './components/purchase-receipts/purchase-receipts.component';
import { AddPurchasesReceiptComponent } from './components/add-purchase-receipt/add-purchase-receipt.component';
import { AddMaterialIssueReceiptComponent } from './components/add-material-issue-receipt/add-material-issue-receipt.component';
import { MaterialIssueReceiptsComponent } from './components/material-issue-receipts/material-issue-receipts.component';
import { AddMaterialRequestComponent } from './components/add-material-request/add-material-request.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryLayoutComponent,
    children: [
      { path: 'home', component: InventoryHomeComponent },
      { path: 'items-category', component: ItemsCategoryComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'purchase-receipts', component: PurchaseReceiptsComponent },
      { path: 'add-purchase-receipt', component: AddPurchasesReceiptComponent },
      { path: 'material-issue', component: MaterialIssueReceiptsComponent },
      { path: 'add-material-issue', component: AddMaterialIssueReceiptComponent },
      { path: 'receive-orders', component: ReceiveOrdersComponent },
      { path: 'delivery-notes', component: DeliveryNotesComponent },
      { path: 'add-delivery-note', component: AddDeliveryNoteComponent },
      { path: 'add-receive-order', component: AddReceiveOrderComponent },
      { path: 'add-item', component: AddItemComponent },
      { path: 'purchases-requests', component: PurchasesRequestsComponent },
      { path: 'add-material-request', component: AddMaterialRequestComponent },
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
