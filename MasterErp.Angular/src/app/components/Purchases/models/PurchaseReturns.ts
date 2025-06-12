import { GeneralOrderDetailsModel } from "../../Inventory/models/GeneralOrderModel ";
import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface PurchaseReturnsModel extends CreatorModel {
    purchaseReturnsId: number | null;
    serialNumber: string;
    docNumber: string;
    purchaseInvoiceId: number | null;
    supplierReturnsVoucherId: number | null;
    totalValue: number | null;
    returnsDate: string | null;
    supplierId: number | null;
    supplierNameEN: string;
    supplierNameAR: string;
    notes: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount: number | null;
}