import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeFinancialCustodyModel extends CreatorModel {
    employeeFinancialCustodyId: number | null;
    employeeId: number | null;
    financialCustodyTypeId: number;
    moneyAmount: number;
    executionDate: string;
    branchId: number | null;
    workflowStatusId: number | null;
    notes: string;
    financialCustodyTypeNameEN: string;
    financialCustodyTypeNameAR: string;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    branchNameEN: string;
    branchNameAR: string;
    jobNameEN: string;
    jobNameAR: string;
    totalCount: number | null;
}