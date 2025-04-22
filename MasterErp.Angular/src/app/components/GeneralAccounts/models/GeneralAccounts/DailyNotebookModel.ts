import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface DailyNotebookModel extends CreatorModel {
    dailyNotebookId: number | null;
    nameEN: string;
    nameAR: string;
    ledgerTypeId: number;
    code: string;
    virtualAccount: string;
    receiptLedgerTypeNameEN: string;
    receiptLedgerTypeNameAR: string;
    totalCount: number | null;
}