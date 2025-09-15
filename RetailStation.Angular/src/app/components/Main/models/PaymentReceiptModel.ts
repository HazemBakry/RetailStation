import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface PaymentReceiptModel extends CreatorModel {
    paymentReceiptId: number | null;
    receiptNumber: number | null;
    paymentTypeId: number;
    releaseDate: string | null;
    contactName: string;
    fromAccountId: number | null;
    toAccountId: number | null;
    supplierId: number | null;
    moneyAmount: number;
    workflowStatusId: number | null;
    journalEntryId: number | null;
    docNumber: string;
    currencyId: number | null;
    description: string;
    paymentTypeName: string;
    chequeNumber: string;
    supplierName: string;
    currency: string;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    totalCount: number | null;
    nextId: number | null;
    previousId: number | null;
}