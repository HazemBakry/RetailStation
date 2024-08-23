import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface ItemCategoryModel extends CreatorModel {
    itemCategoryId?: number | null;
    nameAR: string;
    nameEN: string;
    description: string;
    displayOrder: number | null;
    IsActive: boolean | null;
}