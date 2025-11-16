import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface MerchantModel extends CreatorModel {
    merchantId: number | null;
    code: string;
    nameAR: string;
    nameEN: string;
    phone: string;
    email: string;
    mobile: string;
    countryId: number | null;
    countryName: string;
    cityId: number | null;
    cityName: string;
    regionId: number | null;
    regionName: string;
    address: string;
    commercialRegister: string;
    taxNumber: string;
    bankAccountNumber: string;
    brandName: string;
    beginningBalance: number | null;
    deliveryCost: number | null;
    deliveryTime: number | null;
    paymentMethodId: number | null;
    paymentMethod: string;
    contactPerson: string;
    contactMobile: string;
    notes: string;
    isActive: boolean;
    rate: number | null;
    imageUrl: string;
    totalCount: number | null;
}