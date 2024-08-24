import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";

export interface InventoryModel {
   
}


export interface OrderModel {
    orderNumber: number ;
    docNumber: string;
    supplierId: number | null ;
    branchId: number | null ;
    inventoryId: number | null ;
    purchaseOrderId: number | null ;
    purchaseInvoiceId: number | null ;
    totalValue: number;
    isLocked: boolean | null ;
    isCancelled: boolean | null ;
    notes: string | null ;
    items: OrderDetailModel[];
}
