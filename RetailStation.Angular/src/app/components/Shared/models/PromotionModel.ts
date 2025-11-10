import { MerchantItemModel } from "./MerchantItemModel";

export interface PromotionModel extends MerchantItemModel {
    promotionId: number | null;
    merchantItemId: number | null;
    merchantId: number | null;
    title: string;
    description: string | null;
    image: File | null;
    imageURL: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isAdminApproved: boolean;
    //offerPrice?: number|null;
    minQty?: number;
    maxQty?: number;
    totalCount?: number;
}