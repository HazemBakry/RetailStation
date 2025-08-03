import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '../Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderSidePanelComponent } from './components/purchase-order-side-panel/purchase-order-side-panel.component';
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
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';
import { ItemLookupsComponent } from './components/item-lookups/item-lookups.component';
import { ItemsFollowupReportComponent } from './components/items-followup-report/items-followup-report.component';
import { ReceivedItemsReportComponent } from './components/received-items-report/received-items-report.component';
import { MaterialReceiptsReportComponent } from './components/material-receipts-report/material-receipts-report.component';
import { ReceivedItemsSummaryReportComponent } from './components/received-items-summary-report/received-items-summary-report.component';
import { ReceivedItemsDetailsReportComponent } from './components/received-items-details-report/received-items-details-report.component';


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
    PurchaseOrderSidePanelComponent,
    AddMaterialRequestComponent,
    PurchasesRequestsComponent,
    AddItemComponent,
    UnitsComponent,
    MaterialRequestsComponent,
    InventoryDashboardComponent,
    ItemLookupsComponent,
    ItemsFollowupReportComponent,
    ReceivedItemsReportComponent,
    MaterialReceiptsReportComponent,
    ReceivedItemsSummaryReportComponent,
    ReceivedItemsDetailsReportComponent
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
