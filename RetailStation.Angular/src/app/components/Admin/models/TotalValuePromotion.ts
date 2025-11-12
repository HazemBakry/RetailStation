import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface TotalValuePromotionModel extends CreatorModel {
    totalValuePromotionId: number;

    code: string | null;
    title: string;
    description: string | null;
    image: string;
    discountValue: number;
    isPercentage: boolean;
    valueType: 'PERCENT' | 'FIXED_AMOUNT'; 
    maxUsesGlobal: number | null;
    maxUsesPerCustomer: number | null;
    minValue: number | null;
    startDate: Date | string; 
    endDate: Date | string;
    isActive: boolean;

}