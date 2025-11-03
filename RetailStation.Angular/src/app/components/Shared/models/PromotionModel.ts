import { MerchantItemModel } from "./MerchantItemModel";

export interface PromotionModel extends MerchantItemModel {
    promotionId: number | null;
    itemId: number | null;
    title: string;
    description: string | null;
    image: File | null;
    imageURL: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    //offerPrice?: number|null;
    minQty?: number;
    maxQty?: number;
    totalCount?: number;
}