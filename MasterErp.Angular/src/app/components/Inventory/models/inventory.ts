import { ItemModel } from "src/app/Models/ItemModel";

export interface InventoryModel {
   
}


export interface ReceiveOrderModel {
    orderNumber: number ;
    supplierId: number ;
    inventoryId: number ;
    purchaseOrderId: number ;
    purchaseInvoiceId: number ;
    totalValue: number;
    isLocked: boolean;
    isCancelled: boolean;
    notes: string;
    docNumber: string;
    items: ItemModel[];
}
