import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface EmployeeOverTimeModel extends CreatorModel {
    overTimeId: number;
    employeeId: number;
    employeeName: string;
    requestDate: string;
    executionDate: string;
    noHours: number;
    moneyAmount: number;
    notes: string;
    isActive: boolean;
    totalCount: number | null;
}