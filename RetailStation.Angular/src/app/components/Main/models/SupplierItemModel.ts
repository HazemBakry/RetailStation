import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface SupplierItemModel extends CreatorModel {
    supplierItemId?: number | null;
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
    price: number | null;
    purchasePrice: number | null;
    isActive: boolean | null;
    itemTypeId: number | null;
    supplierId: number | null;
    supplierName: string;
    disabled: boolean | null;

}
