import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";
import { GeneralOrderDetailsModel, GeneralOrderModel } from "../../Inventory/models/GeneralOrderModel ";



export interface PurchaseInvoiceModel extends GeneralOrderModel {
    purchaseInvoiceId: number | null;
    materialReceiptIds: number[];
    supplierId: number;
    supplierNameAR: string;
    supplierNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    nextId?: number|null;
    previousId?: number|null;
    totalCount?: number;
    isChecked: boolean;

}

export interface PurchaseInvoiceDetails {
 
}