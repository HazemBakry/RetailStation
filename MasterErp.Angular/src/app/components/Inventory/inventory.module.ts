import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderSearchSidepanelComponent } from './components/order-search-sidepanel/order-search-sidepanel.component';
import { ItemsCategoryComponent } from './components/items-category/items-category.component';
import { InventoryLayoutComponent } from './inventory-layout/inventory-layout.component';
import { PurchasesRequestsComponent } from './components/purchases-requests/purchases-requests.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { InventoryHomeComponent } from './components/inventory-home/inventory-home.component';
import { UnitsComponent } from './components/units/units.component';
import { ItemsComponent } from './components/items/items.component';
import { AddDeliveryNoteComponent } from './components/add-delivery-note/add-delivery-note.component';
import { DeliveryNotesComponent } from './components/delivery-notes/delivery-notes.component';
import { PurchaseReceiptsComponent } from './components/purchase-receipts/purchase-receipts.component';
import { AddPurchasesReceiptComponent } from './components/add-purchase-receipt/add-purchase-receipt.component';
import { MaterialIssueReceiptsComponent } from './components/material-issue-receipts/material-issue-receipts.component';
import { AddMaterialIssueReceiptComponent } from './components/add-material-issue-receipt/add-material-issue-receipt.component';
import { AddMaterialRequestComponent } from './components/add-material-request/add-material-request.component';
import { MaterialRequestsComponent } from './components/material-requests/material-requests.component';
import { AddMaterialReceiptComponent } from './components/add-material-receipt/add-material-receipt.component';
import { MaterialReceiptsComponent } from './components/material-receipts/material-receipts.component';


@NgModule({
  declarations: [
    InventoryLayoutComponent,    
    InventoryHomeComponent,
    ItemsCategoryComponent,
    ItemsComponent,
    PurchaseReceiptsComponent,
    AddPurchasesReceiptComponent,
    MaterialIssueReceiptsComponent,
    AddMaterialIssueReceiptComponent,
    AddMaterialReceiptComponent,
    MaterialReceiptsComponent,
    DeliveryNotesComponent,
    AddDeliveryNoteComponent,
    OrderSearchSidepanelComponent,
    AddMaterialRequestComponent,
    PurchasesRequestsComponent,
    AddItemComponent,
    UnitsComponent,
    MaterialRequestsComponent
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
