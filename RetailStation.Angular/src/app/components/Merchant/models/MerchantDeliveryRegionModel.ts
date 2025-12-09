import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface MerchantDeliveryRegionModel extends CreatorModel {
    merchantDeliveryRegionId: number | null;
    merchantId: number | null;
    countryId: number;
    cityId: number | null;
    regionId: number | null;
    cost: number;
    deliveryTime: number;
    deliveryTimeUnit: string;
    isActive: boolean;
    countryNameAR: string;
    countryNameEN: string;
    cityNameAR: string;
    cityNameEN: string;
    regionNameAR: string;
    regionNameEN: string;
    totalCount: number | null;
}