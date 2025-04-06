export interface ReceiptModel {
    receiptId: number | null;
    orderNumber: number | null;
    receiptNumber: number | null;
    paymentTypeId: number;
    receiptLedgerId: number | null;
    receiptTypeId: number | null;
    paymentOrderId: number | null;
    releaseDate: string;
    contactName: string,
    fromAccountId: number | null;
    bankAccountId: number | null;
    agencyTypeId: number;
    accountId: number | null;
    supplierId: number | null;
    customerId: number | null;
    employeeId: number | null;
    moneyAmount: number;
    docNumber: string;
    currencyId: number | null;
    description: string;
    workflowStatusId: number | null;
    workflowStatusNameAR: string;
    workflowStatusNameEN: string;
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

