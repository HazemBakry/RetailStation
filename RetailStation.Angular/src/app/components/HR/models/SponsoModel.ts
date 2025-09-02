import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface SponsorModel extends CreatorModel {
    sponsorId: number | null;
    code: string;
    nameAR: string;
    nameEN: string;
    sponsorSSN: string;
    parentId: number | null;
    parentNameAR: string;
    parentNameEN: string;
    phone1: string;
    phone2: string;
    sponsorTypeId: number;
    sponsorTypeNameAR: string;
    sponsorTypeNameEN: string;
    address: string;
    isActive: boolean;
    fileName: string;
    notes: string;
    saudi_Count: number | null;
    saudi_Amount: number | null;
}