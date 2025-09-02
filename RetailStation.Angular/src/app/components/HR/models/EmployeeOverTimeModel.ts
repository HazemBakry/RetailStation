import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface EmployeeOverTimeModel extends CreatorModel {
    overTimeId: number;
    employeeId: number;
    employeeName: string;
    requestDate: string;
    executionDate: string;
    noHours: number;
    overtimeRatio: number;
    moneyAmount: number;
    notes: string;
    isActive: boolean;
    workflowStatusId: number | null;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    totalCount: number | null;
}