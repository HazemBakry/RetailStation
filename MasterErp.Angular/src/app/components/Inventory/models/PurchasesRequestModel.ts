import { OrderDetailModel } from "src/app/Models/ItemModel";

export interface PurchaseRequestModel {
    purchaseRequestId: number | null;
    requestNumber: number | null;
    requestDate: string | null;
    branchId: number | null;
    notes: string;
    userId: string;
    items: OrderDetailModel[];
}