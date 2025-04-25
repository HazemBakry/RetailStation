import { GeneralOrderDetailsModel, GeneralOrderModel } from "./GeneralOrderModel ";

export interface MaterialRequestModel extends GeneralOrderModel {
    materialRequestId: number;
    purchaseOrderId?: number;
    branchId: number;
    branchNameAR: string;
    branchNameEN: string;
    purposeId: number;
    purposeNameAR: string;
    purposeNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    totalCount?: number;
    isChecked: boolean;

}
export interface MaterialRequestDetailsModel extends GeneralOrderDetailsModel {
    materialRequestId: number;

}
