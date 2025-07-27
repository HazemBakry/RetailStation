import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface PurchaseInvoiceTypeModel extends CreatorModel {
    purchaseInvoiceTypeId: number | null;
    accountDebitId: number | null;
    accountCreditId: number | null;
    nameEN: string;
    nameAR: string;
    debitAccountNameEN: string;
    debitAccountNameAR: string;
    creditAccountNameEN: string;
    creditAccountNameAR: string;
    notes: string;
    isBindToGeneralAccounting: boolean;
    isActive: boolean | null;
    totalCount: number | null;
}