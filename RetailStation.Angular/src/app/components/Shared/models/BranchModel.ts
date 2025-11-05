import { CreatorModel } from "./CreatorModel";

export interface BranchModel extends CreatorModel {
    branchId: number;
    nameAR: string;
    nameEN: string;
    phone: string | null;
    address: string | null;
    regionId: number | null;
    isActive: boolean;
    image: string | null;

    // Time fields
    openingTimeFrom: string | null;
    openingTimeTo: string | null;

    workingTimeAR: string | null;
    workingTimeEN: string



    ///old data
    subscriberId: string;
    code: string;
    displayOrder: number | null;
    isAdminBranch: boolean;
    cityId: number | null;
    drawingsCostCenterId: number | null;
    expensesCostCenterId: number | null;
    email: string;
    fax: string;
    notes: string;
}