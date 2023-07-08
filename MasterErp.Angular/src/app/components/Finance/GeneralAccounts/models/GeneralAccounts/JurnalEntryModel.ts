
export interface JournalEntryModel {
    docNumber?: string;
    entryNumber?: string;
    entryDate?: string;
    descirption?: string;
    notes?: string;
    month?: number;
    year?: number;
    journalTypeID?: number;
    journalEntryAccounts?: JournalEntryAccount[];
}

export interface JournalEntryAccount {
    accountID?: number;
    debit?: number | null;
    credit?: number | null;
    costCenterID?: number | null;
    costValue?: number | null;
    costPercent?: number | null;
    currencyID?: number | null;
    description?: string;
}