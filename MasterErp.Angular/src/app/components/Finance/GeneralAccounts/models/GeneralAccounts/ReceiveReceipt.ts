export interface ReceiveReceipt {
    receiveReceiptId: number;
    receiptNumber: number;
    receiptLedgerId: number;
    receiveTypeId: number;
    accountId: number;
    receivedById: number | null;
    safeId: number | null;
    agencyTypeId: number | null;
    agencyId: number | null;
    moneyAmount: number;
    isLocked: boolean;
    isCancelled: boolean;
    notes: string;
    chequeNumber: string;
    docNumber: string;
    benefitPerson:string;
    insertUser: string;
    updateUser: string;
    releaseDate: string;
    insertDate: string;
    updateDate: string | null;
}