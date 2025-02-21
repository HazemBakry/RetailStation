
export interface JournalEntryModel {
    journalEntryId?:number;
    docNumber?: string;
    entryNumber?: string;
    entryDate?: Date;
    description?: string;
    notes?: string;
    month?: number;
    year?: number;
    journalTypeId?: number;
    currencyTypeId?: number;
    isChecked?: boolean;
    journalEntryAccounts?: JournalEntryAccount[];

    entryMonth?: number | null;
    journalTypeAR?: string;
    journalTypeEN?: string;
    actionTypeAR?: string;
    actionTypeEN?: string;
    actionGroup?: string;
    isLocked?: boolean | null;
    entryStatus?: boolean | null;
    isPosted?: boolean | null;
    postStatus?: boolean | null;
    totalCredit?: number | null;
    totalDebit?: number | null;

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