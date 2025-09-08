import { FilterItem } from "./FilterModel";

export class PagedResponseDTO<T=any[]> {

    success?: boolean;
    message?: string;
    currentPage?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    fromDate?: string;
    toDate?: string;
    isExport?: boolean;
    customerId?:string;
    results: T;
    searchText?:string;
    filterList?:FilterItem[]
}
export class PagedResponseModel<T=any[]> {

    success?: boolean;
    message?: string;
    currentPage?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    fromDate?: string;
    toDate?: string;
    isExport?: boolean;
    customerId?:string;
    results: T;
    searchText?:string;
    filterList?:FilterItem[]
}