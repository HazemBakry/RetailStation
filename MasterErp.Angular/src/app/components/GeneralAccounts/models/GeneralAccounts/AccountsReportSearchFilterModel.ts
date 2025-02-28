import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";

export interface AccountsReportSearchFilterModel extends PagedResponseDTO {
    accountId?: number | null;
    accountLevel?: number | null;
    costCenterId?: number | null;
    hideEmptyAccounts: boolean;

    searchType?: number | null;
    searchLevel?: number | null;
}

export interface AccountsGeneralLedgerModel {
    accountId: number | null;
    parentAccountId: number | null;
    nameAR: string;
    nameEN: string;
    accountNumber: string;
    preDebit: number | null;
    preCredit: number | null;
    debit: number | null;
    credit: number | null;
    totalDebit: number | null;
    totalCredit: number | null;
}


export interface AccountsAssistantLedgerModel {
    accountId?: number;
    entryNumber?: number;
    entryDate?: Date;
    entryType?: string;
    chequeNumber?: string;
    description?: string;
    debit?: number;
    credit?: number;
    balanceDebit?: number;
    balanceCredit?: number;
    totalCount?: number;
}

export interface TrialBalanceModel {
    accountId?: number;
    accountNameAR: string;
    accountNameEN: string;
    accountNumber: string;
    preDebit: number | null;
    preCredit: number | null;
    debit: number | null;
    credit: number | null;
    totalDebit: number | null;
    totalCredit: number | null;
    balanceDebit?: number;
    balanceCredit?: number;
    totalCount?: number;
}
