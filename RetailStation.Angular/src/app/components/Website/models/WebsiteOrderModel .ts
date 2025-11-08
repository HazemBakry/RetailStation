import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface WebsiteOrderModel extends CreatorModel {
    orderId: number | null;
    orderNumber: number | null;
    serialNumber: number | null;
    docNumber: string;
    orderDate: string | null;
    dueDate: string | null;
    workflowStatusNameAR: string;
    workflowStatusNameEN: string;
    workflowStatusId: number | null;
    orderTypeId: number | null;
    orderTypeAR: string;
    orderTypeEN: string;
    merchantId: number | null;
    paymentTypeId: number | null;
    paymentTypeNameEN: string;
    paymentTypeNameAR: string;
    merchantNameAR: string;
    merchantNameEN: string;
    branchId: number | null;
    branchNameAR: string;
    branchNameEN: string;
    storeId: number | null;
    storeNameAR: string;
    storeNameEN: string;
    deliveryValue: number | null;
    subTotal: number | null;
    tax: number | null;
    taxPercent: number | null;
    discount: number | null;
    discountPercent: number | null;
    totalValue: number;
    netValue: number | null;
    notes: string;
    totalCount: number | null;
    paymentOrderId: number | null;
    items: WebsiteOrderItemModel[];
}

export interface WebsiteOrderItemModel {
    orderDetailsId?: number | null;
    orderId?: number | null;
    merchantItemId: number | null;
    nameAR?: string;
    nameEN?: string;
    image: string;
    itemId?: number;
    unitId?: number | null;
    quantity: number;
    price: number | null;
    subTotal: number;
    discount: number | null;
    discountPercent: number | null;
    totalValue: number;
    notes?: string;
    itemNameAR?: string;
    itemNameEN?: string;
    unitName?: string;
    purchaseUnitId?: number | null;
    purchaseUnitName?: string;
    itemCategoryId?: number | null;
    itemCategoryName?: string;
    isActive?: boolean;
    itemTypeId?: number | null;
    merchantId: number | null;
    merchantNameEN?: string;
    merchantNameAR?: string;
    imageUrl?: string;
    totalCount?: number | null;
}

export interface CreateOrderModel extends CreatorModel {
    orderId?: number | null;
    orderNumber?: number | null;
    serialNumber?: number | null;
    docNumber?: string;
    orderDate?: string | null;
    dueDate?: string | null;
    orderTypeId?: number | null;
    paymentTypeId: number | null;
    deliveryValue: number | null;
    subTotal: number | null;
    tax: number | null;
    taxPercent: number | null;
    discount: number | null;
    discountPercent: number | null;
    totalValue: number;
    netValue: number | null;
    notes: string;
    items: CreateOrderItemModel[];
}

export interface CreateOrderItemModel {
    merchantItemId: number | null;
    itemId?: number;
    unitId?: number | null;
    quantity: number;
    price: number | null;
    subTotal: number;
    discount: number | null;
    discountPercent: number | null;
    totalValue: number;
    notes?: string;
    merchantId: number | null;
}