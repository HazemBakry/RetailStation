import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeCareerModel extends CreatorModel {
    employeeCareerId?: number | null;
    employeeId: number;
    employeeName: string;
    jobId: number;
    jobName: string;
    branchId: number;
    branchName: string;
    workStatusId: number;
    workStatusName: string;
    workflowStatusId: number | null;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    notes: string;
    executionDate: string;
    totalCount: number | null;
    modifySalary: boolean;
    // salary section
    basicSalary: number;
    extraSalary: number;
    transportation: number;
    housingAllowance: number;
    mobileAllowance: number;
    workNature: number;
    mealAllowance: number;
    other: number | null;
}