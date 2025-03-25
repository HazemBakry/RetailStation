import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";
import { GeneralOrderDetailsModel, GeneralOrderModel } from "../../Inventory/models/GeneralOrderModel ";

export interface PurchaseOrderModel extends GeneralOrderModel {
    purchaseOrderId?: number;
    materialRequestIds: number[];
    supplierId: number;
    supplierNameAR: string;
    supplierNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount?: number;
    isChecked: boolean;

}

