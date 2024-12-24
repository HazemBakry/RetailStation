import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeSickLeaveModel extends CreatorModel 
{
    sickLeaveId: number | null;
    employeeId: number;
    employeeName: string;
    requestDate: string | null;
    executionDate: string;
    noDays: number;
    moneyAmount: number;
    notes: string;
    isActive: boolean;
    totalCount: number | null;
}