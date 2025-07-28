import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeStatusModel extends CreatorModel {
    employeeStatusId: number | null;
    statusNameEN: string;
    statusNameAR: string;
    notes: string;
    isActive: boolean | null;
}