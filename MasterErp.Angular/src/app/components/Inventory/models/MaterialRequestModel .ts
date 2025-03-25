import { GeneralOrderDetailsModel, GeneralOrderModel } from "./GeneralOrderModel ";

export interface MaterialRequestModel extends GeneralOrderModel {
    materialRequestId: number;
    purchaseOrderId?: number;
    branchId: number;
    branchNameAR: string;
    branchNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount?: number;
    isChecked: boolean;

}
export interface MaterialRequestDetailsModel extends GeneralOrderDetailsModel {
    materialRequestId: number;

}
