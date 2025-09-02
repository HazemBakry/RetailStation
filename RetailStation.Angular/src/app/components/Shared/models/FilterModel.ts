export interface FilterModel {
    currentPage?: number;
    pageSize?: number;
    categoryDisplayName?: string;
    searchText?: string;
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
    searchText?: string;
    searchLevel?: string;
    hideEmptyAccounts?: boolean ;
    isExport?: boolean;
    filterModel?: FilterModel;
    filterItems?: FilterItem[];
}

