import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { UnitsComponent } from './components/units/units.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { DeliveryNotesComponent } from './components/delivery-notes/delivery-notes.component';
import { AddDeliveryNoteComponent } from './components/add-delivery-note/add-delivery-note.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { PurchaseReceiptsComponent } from './components/purchase-receipts/purchase-receipts.component';
import { AddPurchasesReceiptComponent } from './components/add-purchase-receipt/add-purchase-receipt.component';
import { AddMaterialIssueReceiptComponent } from './components/add-material-issue-receipt/add-material-issue-receipt.component';
import { MaterialIssueReceiptsComponent } from './components/material-issue-receipts/material-issue-receipts.component';
import { AddMaterialRequestComponent } from './components/add-material-request/add-material-request.component';
import { PurchaseOrdersComponent } from '../Purchases/components/purchase-orders/purchase-orders.component';
import { AddPurchaseOrderComponent } from '../Purchases/components/add-purchase-order/add-purchase-order.component';
import { MaterialRequestsComponent } from './components/material-requests/material-requests.component';
import { AddMaterialReceiptComponent } from './components/add-material-receipt/add-material-receipt.component';
import { MaterialReceiptsComponent } from './components/material-receipts/material-receipts.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryLayoutComponent,
    children: [
      { path: 'home', component: InventoryHomeComponent },
      { path: 'home/:tabName', component: InventoryHomeComponent },
      { path: 'items-category', component: ItemsCategoryComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'purchase-receipts', component: PurchaseReceiptsComponent },
      { path: 'add-purchase-receipt', component: AddPurchasesReceiptComponent },
      { path: 'material-issue', component: MaterialIssueReceiptsComponent },
      { path: 'add-material-issue', component: AddMaterialIssueReceiptComponent },
      { path: 'material-receipt', component: MaterialReceiptsComponent },
      { path: 'delivery-notes', component: DeliveryNotesComponent },
      { path: 'add-delivery-note', component: AddDeliveryNoteComponent },
      { path: 'add-material-receipt', component: AddMaterialReceiptComponent },
      { path: 'add-item', component: AddItemComponent },
      { path: 'purchases-requests', component: PurchasesRequestsComponent },
      { path: 'material-requests', component: MaterialRequestsComponent },
      { path: 'add-material-request', component: AddMaterialRequestComponent },
      { path: 'units', component: UnitsComponent },      
      { path: 'purchase-orders', component: PurchaseOrdersComponent },
      { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
      
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule { }
