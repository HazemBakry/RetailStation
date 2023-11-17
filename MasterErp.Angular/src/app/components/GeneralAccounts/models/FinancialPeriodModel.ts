export interface FinancialPeriodModel {
    financialPeriodId: number | null;
    code: string;
    nameAR: string;
    nameEN: string;
    startDate: string;
    endDate: string;
    isLocked: boolean;
    isActive: boolean;
    notes: string;
}