import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";
import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface SupplierModel extends CreatorModel {
    supplierId: number | null;
    code: string;
    nameAR: string;
    nameEN: string;
    phone: string;
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
    beginningBalance: number | null;
    balanceTypeId: number;
    balanceType: string;
    supplierGroupId: number | null;
    supplierGroupName: string;
    contactPerson: string;
    contactMobile: string;
    notes: string;
    isActive: boolean;
}