import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface DepartmentModel extends CreatorModel {
    departmentId: number | null;
    branchId: number | null;
    branchNameAR: string;
    branchNameEN: string;
    code: string;
    nameAR: string;
    nameEN: string;
    location: string;
    isSystem: boolean | null;
    description: string;
    managerId: number | null;
    managerNameAR: string;
    managerNameEN: string;
}