import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeCareerModel extends CreatorModel {
    careerId?: number | null;
    employeeId: number;
    employeeName: string;
    jobId: number;
    jobName: string;
    branchId: number;
    branchName: string;
    workStatusId: number;
    workStatusName: string;
    notes: string;
    executionDate: string;
    totalCount: number | null;
}