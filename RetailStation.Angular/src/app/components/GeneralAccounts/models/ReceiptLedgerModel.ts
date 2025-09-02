export interface ReceiptLedgerModel {
    receiptLedgerId: number | null;
    startReceiptNumber: number;
    financialPeriodId: number;
    receiptLedgerTypeId: number;
    paymentTypeId: number;
    isActive: boolean;
    isLocked: boolean;
    code: string;
    nameAR: string;
    nameEN: string;
    notes: string;

    financialPeriodNameEN: string;
    financialPeriodNameAR: string;
    receiptLedgerTypeNameEN: string;
    receiptLedgerTypeNameAR: string;
    paymentTypeNameEN: string;
    paymentTypeNameAR: string;
    totalCount: number | null;
}
