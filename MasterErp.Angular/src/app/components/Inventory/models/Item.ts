export interface ItemModel {
    itemId?: number;
    nameEN?: string;
    nameAR?: string;
    subUnitId?: number;
    mainUnitId?: number;
    itemCategoryId?: number;
    cost?: number;
    convertRatio?: number;
    isActive?: boolean;
    insertUser?: string;
    insertDate?: string;
    itemsSupplier?: ItemSupplier[];
}

export interface ItemSupplier {
    id?: number;
    supplierId?: number;
    supplierName?: string;
    itemId?: number;
    itemName?: string;

}