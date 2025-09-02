import { GeneralOrderDetailsModel, GeneralOrderModel } from "./GeneralOrderModel ";

export interface MaterialIssueModel extends GeneralOrderModel {
    materialIssueId: number;
    purchaseOrderId?: number;
    storeId: number;
    storeNameAR: string;
    storeNameEN: string;
    branchId: number;
    branchNameAR: string;
    branchNameEN: string;
    orderDetails: GeneralOrderDetailsModel[];
    nextId?: number|null;
    previousId?: number|null;
    totalCount?: number;
    isChecked: boolean;

}