import { CreatorModel } from "./CreatorModel";

export interface BranchModel extends CreatorModel {
    branchId: number | null;
    subscriberId: string;
    code: string;
    displayOrder: number | null;
    nameAR: string;
    nameEN: string;
    isActive: boolean;
    isAdminBranch: boolean;
    cityId: number | null;
    drawingsCostCenterId: number | null;
    expensesCostCenterId: number | null;
    phone: string;
    email: string;
    fax: string;
    openingTimeFrom:string | null;
    openingTimeTo:string | null;
    address: string;
    notes: string;
}