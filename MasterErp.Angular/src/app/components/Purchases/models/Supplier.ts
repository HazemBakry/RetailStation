import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";

export interface Supplier{

    NameAr: string;
    NameEn: string;
    Code:string,
    Phone: string;
    CommercialRegister: number;
    TaxNumber: number;
    GroupId: number | null;
    userId: string | null;
}
