import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface PaymentTermModel extends CreatorModel {
    paymentTermId: number | null;
    nameEN: string;
    nameAR: string;
    isActive: boolean;
    paymentTermDetails: PaymentTermDetailsModel[];
    totalCount: number | null;
}

export interface PaymentTermDetailsModel extends CreatorModel {
    paymentTermDetailsId: number | null;
    paymentTermId: number;
    duePercentage: number;
    dueAfterDays: number;
}