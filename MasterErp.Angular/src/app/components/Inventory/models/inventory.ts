import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";
import { CreatorModel } from "../../Shared/models/CreatorModel";
import { GeneralOrderDetailsModel } from "./GeneralOrderModel ";

export interface InventoryModel {

}



export interface OrderModel extends CreatorModel {
    orderId?: number | null;
    secondaryOrderId?: number | null;
    secondaryOrderIds?: number[] | [];
    orderNumber?: number;
    docNumber?: string;
    orderDate?: string;
    dueDate?: string | null;
    orderTypeId?: number | null;
    orderTypeAR?: string;
    orderTypeEN?: string;
    supplierId?: number | null;
    supplierNameAR?: string;
    supplierNameEN?: string;
    inventoryId?: number | null;
    branchId?: number | null;
    branchNameAR?: string;
    branchNameEN?: string;
    storeId?: number | null;
    storeNameAR?: string;
    storeNameEN?: string;
    subTotal?: number | null;
    tax?: number | null;
    taxPercent?: number | null;
    discount?: number | null;
    discountPercent?: number | null;
    totalValue?: number;
    netValue?: number | null;
    description?: string;
    notes?: string;
    isLocked?: boolean | null;
    isCancelled?: boolean | null;
    totalCount?: number | null;
    purchaseOrderId?: number | null;
    orderProducts?: GeneralOrderDetailsModel[];
    items?: GeneralOrderDetailsModel[];
    isChecked?: boolean;

    statusId?:number | null;
    statusNameAR?: string;
    statusNameEN?: string;
}

// export interface GeneralOrderDetailsModel {
//     itemId: number;
//     itemNameAR: string;
//     itemNameEN: string;
//     unitId: number | null;
//     unitNameAR: string;
//     unitNameEN: string;
//     price: number;
//     quantity: number;
//     requestedQuantity?: number;
//     totalValue: number;
//     isActive: boolean | null;
// }