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

export interface SearchFilterModel {
    fromDate?: string;
    toDate?: string;
    branchID?: number;
    userName?: string;
    currentPage?: number;
    pageSize?: number;
    searchType?: string;
    transferType?: string;
    SearchText?: string;
    isExport?: boolean;
    filterModel?: FilterModel;
}