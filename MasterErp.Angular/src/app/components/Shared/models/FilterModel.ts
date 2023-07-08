export interface FilterModel {
    currentPage?: number;
    pageSize?: number;
    categoryDisplayName?: string;
    filterItems?: FilterItem[];
}

export interface FilterItem {
    categoryDisplayName?: string;
    categoryName?: string;
    itemKey?: string;
    itemFlag?: string;
    itemValue?: string;
    isChecked?: boolean;
}