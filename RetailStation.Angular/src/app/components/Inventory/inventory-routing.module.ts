import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { DeliveryNotesComponent } from './components/delivery-notes/delivery-notes.component';
import { AddDeliveryNoteComponent } from './components/add-delivery-note/add-delivery-note.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { PurchaseReceiptsComponent } from './components/purchase-receipts/purchase-receipts.component';
import { AddMaterialIssueReceiptComponent } from './components/add-material-issue-receipt/add-material-issue-receipt.component';
import { MaterialIssueReceiptsComponent } from './components/material-issue-receipts/material-issue-receipts.component';
import { AddMaterialRequestComponent } from './components/add-material-request/add-material-request.component';
import { PurchaseOrdersComponent } from '../Purchases/components/purchase-orders/purchase-orders.component';
import { AddPurchaseOrderComponent } from '../Purchases/components/add-purchase-order/add-purchase-order.component';
import { MaterialRequestsComponent } from './components/material-requests/material-requests.component';
import { AddMaterialReceiptComponent } from './components/add-material-receipt/add-material-receipt.component';
import { MaterialReceiptsComponent } from './components/material-receipts/material-receipts.component';
import { ItemLookupsComponent } from './components/item-lookups/item-lookups.component';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { ItemsFollowupReportComponent } from './components/items-followup-report/items-followup-report.component';
import { ReceivedItemsReportComponent } from './components/received-items-report/received-items-report.component';
import { MaterialReceiptsReportComponent } from './components/material-receipts-report/material-receipts-report.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryLayoutComponent,
    children: [
      { path: 'home', component: InventoryHomeComponent },
      { path: 'home/:tabName', component: InventoryHomeComponent },
      { path: 'items-category', component: ItemsCategoryComponent, canActivate: [AuthPageGuard], data: { pageName: 'ItemsCategory' } },
      { path: 'item-lookups', component: ItemLookupsComponent, canActivate: [AuthPageGuard], data: { pageName: 'ItemLookups' } },
      { path: 'material-requests', component: MaterialRequestsComponent, canActivate: [AuthPageGuard], data: { pageName: 'MaterialRequests' } },
      { path: 'add-material-request', component: AddMaterialRequestComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent, canActivate: [AuthPageGuard], data: { pageName: 'PurchaseOrders' } },
      { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
      { path: 'material-receipt', component: MaterialReceiptsComponent, canActivate: [AuthPageGuard], data: { pageName: 'MaterialReceipt' } },
      { path: 'add-material-receipt', component: AddMaterialReceiptComponent },
      { path: 'material-issue', component: MaterialIssueReceiptsComponent, canActivate: [AuthPageGuard], data: { pageName: 'MaterialIssue' } },
      { path: 'add-material-issue', component: AddMaterialIssueReceiptComponent },
      { path: 'purchase-receipts', component: PurchaseReceiptsComponent },
      { path: 'delivery-notes', component: DeliveryNotesComponent },
      { path: 'add-delivery-note', component: AddDeliveryNoteComponent },
      { path: 'add-item', component: AddItemComponent },
      { path: 'purchases-requests', component: PurchasesRequestsComponent },
      { path: 'items-followUp-report', component: ItemsFollowupReportComponent },
      { path: 'received-items-report', component: ReceivedItemsReportComponent },
      { path: 'material-receipts-report', component: MaterialReceiptsReportComponent },
      
      
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule { }
