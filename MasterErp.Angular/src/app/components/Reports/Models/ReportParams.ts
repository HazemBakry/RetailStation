import { FilterItem } from "../../Shared/models/FilterModel";

export interface SearchReportModel {
    ControllerName: string;
    ApiName: string;
    MethodType: string;
    companyName: string;
    pageName: string;
    isLandScape: boolean;
    filterItems: FilterItem[];
}