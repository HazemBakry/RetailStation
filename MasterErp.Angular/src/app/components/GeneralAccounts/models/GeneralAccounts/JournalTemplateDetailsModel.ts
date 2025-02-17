export interface JournalTemplateDetails {
    templateDetailId: number;
    journalTemplateId: number;
    accountId: number;
    debit: number | null;
    credit: number | null;
    costCenterId: number | null;
    description: string;
}