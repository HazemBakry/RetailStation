export interface ReceiveReceipt {
    receiveReceiptId: number;
    receiptNumber: number;
    receiptLedgerId: number;
    cashReceiptTypeId: number;
    currencyId: number;
    receivedById: number | null;
    safeId: number | null;
    totalAmount: number;
    isLocked: boolean;
    isCancelled: boolean;
    loanNumber: string;
    ledgerNumber: string;
    justmentNumber: string;
    notes: string;
    insertUser: string;
    updateUser: string;
    releaseDate: string;
    insertDate: string;
    updateDate: string | null;
}