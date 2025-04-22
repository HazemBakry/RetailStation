export interface TaxCalculationModel {
    taxCalculationId: number;
    nameEN: string;
    nameAR: string;
    description: string;
    taxLookupId: number;
    taxType: string;
    taxScope: string;
    taxLookupNameAR: string;
    taxLookupNameEN: string;
    amount: number;
    isActive: boolean;
}