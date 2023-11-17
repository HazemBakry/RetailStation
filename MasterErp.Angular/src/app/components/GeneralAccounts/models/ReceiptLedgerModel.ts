export interface ReceiptLedgerModel {
    receiptLedgerId: number | null;
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
}