import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface PurchaseQuotationModel extends CreatorModel {
    purchaseQuotationId: number;
    quotationNumber: number;
    quotationDate: string;
    notes: string;
    isLocked: boolean | null;
    isCancelled: boolean | null;
    quotationDetails: PurchaseQuotationDetailsModel[];
    totalCount: number | null;
}

export interface PurchaseQuotationDetailsModel {
    purchaseQuotationDetailsId: number;
    purchaseQuotationId: number;
    itemId: number;
    price: number;
    supplierId: number | null;
    supplierNameAR: string;
    supplierNameEN: string;
    notes: string;
    itemNameAR: string;
    itemNameEN: string;
    unitId: number | null;
    unitNameAR: string;
    unitNameEN: string;
}