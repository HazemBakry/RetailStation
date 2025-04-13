import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface GeneralOrderModel extends CreatorModel {
    orderId?: number;
    orderNumber?: number;
    docNumber?: string;
    orderDate?: string;
    dueDate?: string;
    orderStatus?: string;
    statusNameAR?: string;
    statusNameEN?: string;
    statusId?: number;
    orderTypeId?: number;
    orderTypeAR?: string;
    orderTypeEN?: string;
    notes?: string;
    isLocked?: boolean;
    isCancelled?: boolean;
    workflowStatusId: number | null;
    workflowStatusNameAR: string;
    workflowStatusNameEN: string;
    totalValue?: number;
}


export interface GeneralOrderDetailsModel {
    itemId: number;
    itemNameAR: string;
    itemNameEN: string;
    unitId?: number;
    unitNameAR?: string;
    unitNameEN?: string;
    price?: number;
    quantity: number;
    requestedQuantity?: number;
    totalValue: number;
    orderId?: number;
}

