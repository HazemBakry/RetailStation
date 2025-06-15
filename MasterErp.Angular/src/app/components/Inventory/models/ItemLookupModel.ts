import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface ItemLookupModel extends CreatorModel {
    itemLookupId: number | null;
    nameAR: string;
    nameEN: string;
    notes: string;
    branchId: number | null;
    items:ItemLookupDetailsModel[]
}

export interface ItemLookupDetailsModel {
    itemLookupDetailsId: number | null;
    itemId: number;
    itemNameEN: string;
    itemNameAR: string;
    displayOrder: number | null;
    quantity: number | null;
}