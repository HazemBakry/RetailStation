import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";

export interface AccountsReportSearchFilterModel extends PagedResponseDTO {
    accountId?: number | null;
    costCenterId?: number | null;
    hideEmptyAccounts: boolean;
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