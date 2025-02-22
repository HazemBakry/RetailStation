export interface PaymentReceipt {
    paymentReceiptId: number;
    receiptNumber: number;    
    paymentTypeId: number;    
    receiptLedgerId: number;
    releaseDate: string;
    contactName: string,
    bankAccountId: number | null;
    safeId: number | null;
    agencyTypeId: number;
    accountId: number | null;
    supplierId: number | null;
    customerId: number | null;
    employeeId: number | null;
    moneyAmount: number;
    docNumber: string;
    currencyId: number | null;
    description: string;
    isLocked: boolean;
    isCancelled: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string | null;
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

