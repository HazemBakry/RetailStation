import { OrderDetailModel } from "src/app/Models/ItemModel";

export interface PurchaseOrderModel{

    orderNumber: number;
    orderDate: string;
    dueDate: string | null;
    supplierId: number;
    branchId: number;
    totalValue: number;
    notes: string | null;
    userId: string | null;
    items: OrderDetailModel[];
}

export interface PurchaseOrderDetails {
    purchaseOrderDetailsId: number;
    purchaseOrderId: number;
    itemID: number;
    quantity: number;
    price: number;
    totalValue: number;
    unitID: number;
    notes: string | null;
}