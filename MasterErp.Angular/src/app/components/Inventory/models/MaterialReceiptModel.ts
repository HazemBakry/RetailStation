import { GeneralOrderDetailsModel, GeneralOrderModel } from "./GeneralOrderModel ";

export interface MaterialReceiptModel extends GeneralOrderModel {
    materialReceiptId: number;
    purchaseOrderId?: number;
    storeId: number;
    storeNameAR: string;
    storeNameEN: string;
    supplierId: number;
    supplierNameAR: string;
    supplierNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount?: number;
    isChecked: boolean;

}
export interface MaterialReceiptDetailsModel extends GeneralOrderDetailsModel {
    materialReceiptId: number;

}
