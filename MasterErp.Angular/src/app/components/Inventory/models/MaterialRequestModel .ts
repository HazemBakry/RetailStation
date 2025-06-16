import { GeneralOrderDetailsModel, GeneralOrderModel } from "./GeneralOrderModel ";

export interface MaterialRequestModel extends GeneralOrderModel {
    materialRequestId: number;
    purchaseOrderId?: number;
    storeId: number;
    storeNameAR: string;
    storeNameEN: string;
    purposeId: number;
    purposeNameAR: string;
    purposeNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount?: number;
    nextId?: number|null;
    previousId?: number|null;
    isChecked: boolean;

}
export interface MaterialRequestDetailsModel extends GeneralOrderDetailsModel {
    materialRequestId: number;

}
