export interface PaymentReceipt {
    paymentReceiptId: number;
    receiptNumber: number;
    receiptLedgerId: number;
    paymentTypeId: number;
    paidWithId: number | null;
    safeId: number | null;
    moneyAmount: number;
    agencyTypeId: number;
    supplierId: number | null;
    accountId: number | null;
    isLocked: boolean;
    isCancelled: boolean;
    notes: string;
    docNumber: string;
    benefitPerson:string,
    chequeNumber:string;
    insertUser: string;
    updateUser: string;
    releaseDate: string;
    insertDate: string;
    updateDate: string | null;
}
export interface ReceiptLedger {
    receiptLedgerId: number;
    startReceiptNumber: number;
    periodId: number;
    receiptLedgerTypeId: number;
    operationTypeId: number;
    isActive: boolean;
    isLocked: boolean;
    code: string;
    nameAR: string;
    nameEN: string;
    notes: string;
    insertUser: string;
    updateUser: string;
    insertDate: string;
    updateDate: string | null;
}

