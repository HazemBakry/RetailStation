import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface ItemModel extends CreatorModel {
    itemId?: number | null;
    nameAR: string;
    nameEN: string;
    unitId: number | null;
    unitName: string;
    purchaseUnitId: number | null;
    purchaseUnitName: string;
    itemCategoryId: number | null;
    itemCategoryName: string;
    cost: number | null;
    purchasePrice: number | null;
    yield: number | null;
    convertRatio: number | null;
    isActive: boolean | null;
    itemTypeId: number | null;
    supplierId: number | null;
    supplierName: string;
    disabled: boolean | null;
    image: File | null;
    imageUrl: string;

}
