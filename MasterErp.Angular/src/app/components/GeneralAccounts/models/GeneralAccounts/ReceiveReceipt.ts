export interface ReceiveReceipt {
    receiveReceiptId: number;
    receiptNumber: number;
    paymentTypeId: number;
    receiptTypeId: number | null;
    receiptLedgerId: number;
    releaseDate: string;
    contactName: string;
    bankAccountId: number | null;
    safeId: number | null;
    agencyTypeId: number | null;
    accountId: number | null;
    supplierId: number | null;
    customerId: number | null;
    employeeId: number | null;
    moneyAmount: number;
    docNumber: string;
    currencyId: number | null;
    notes: string;
    isLocked: boolean;
    isCancelled: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string | null;
    modifiedDate: string | null;
}