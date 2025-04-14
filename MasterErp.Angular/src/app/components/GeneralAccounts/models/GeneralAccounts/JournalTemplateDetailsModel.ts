export interface JournalTemplateModel {
    journalTemplateId: number;
    docNumber: string;
    nameAR: string;
    nameEN: string;
    description: string;
    journalTypeId: number;
    periodId: number | null;
    currencyTypeId: number | null;
    accounts:JournalTemplateDetailsModel[];
}
export interface JournalTemplateDetailsModel {
    templateDetailId?: number;
    journalTemplateId?: number;
    accountId?: number;
    accountNAmeAR?: number;
    accountNAmeEN?: number;
    debit?: number | null;
    credit?: number | null;
    costCenterId?: number | null;
    costCenterNameAR?: number | null;
    costCenterNameEN?: number | null;
    description?: string;
}