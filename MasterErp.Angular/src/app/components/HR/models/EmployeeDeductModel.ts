import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeDeductModel extends CreatorModel {
    deductId?: number | null;
    employeeId: number;
    employeeName: string;
    deductTypeId: number;
    deductTypeName: string;
    moneyAmount: number;
    executionDate: string;
    isApproved: boolean | null;
    notes: string;
    totalCount: number | null;
}