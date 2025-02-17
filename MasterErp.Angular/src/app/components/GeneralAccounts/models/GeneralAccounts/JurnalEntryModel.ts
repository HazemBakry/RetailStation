
export interface JournalEntryModel {
    entryId?:number;
    docNumber?: string;
    entryNumber?: string;
    entryDate?: Date;
    description?: string;
    notes?: string;
    month?: number;
    year?: number;
    journalTypeId?: number;
    currencyTypeId?: number;
    journalEntryAccounts?: JournalEntryAccount[];
}

export interface JournalEntryAccount {
    accountId?: number;
    debit?: number | null;
    credit?: number | null;
    costCenterId?: number | null;
    costValue?: number | null;
    costPercent?: number | null;
    currencyId?: number | null;
    description?: string;
    accountNumber?: string;
    accountName?: string;
    notes?: string;
}