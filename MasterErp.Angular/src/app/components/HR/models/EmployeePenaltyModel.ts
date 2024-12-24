import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeePenaltyModel extends CreatorModel {
    penaltyId: number;
    employeeId: number;
    employeeName: string;
    penaltyTypeId: number;
    penaltyType: string;
    penaltyDate: string;
    executionDate: string;
    deductionByDays: number;
    moneyAmount: number;
    deductionAmount: number;
    reason: string;
    isActive: boolean;
    totalCount: number | null;
}