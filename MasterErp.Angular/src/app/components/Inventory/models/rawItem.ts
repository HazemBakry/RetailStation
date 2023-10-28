export interface RawItemModel {
    rawItemId?: number;
    nameEn?: string;
    nameAr?: string;
    subUnitId?: number;
    mainUnitId?: number;
    rawCategoryId?: number;
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