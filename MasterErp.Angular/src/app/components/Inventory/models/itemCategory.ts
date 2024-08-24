import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface ItemCategoryModel extends CreatorModel {
    itemCategoryId: number | null;
    nameAR: string;
    nameEN: string;
    operationAccountId: number | null;
    operationAccountName: string;
    managementAccountId: number | null;
    managementAccountName: string;
    description: string;
    isActive: boolean;
    displayOrder: number | null;
}