import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";

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
    items: OrderDetailModel[];
}
