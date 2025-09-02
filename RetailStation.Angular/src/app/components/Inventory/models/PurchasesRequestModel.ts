import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";

export interface PurchaseRequestModel {
    purchaseRequestId: number | null;
    requestNumber: number | null;
    requestDate: string | null;
    branchId: number | null;
    notes: string;
    userId: string;
    items: OrderDetailModel[];
}