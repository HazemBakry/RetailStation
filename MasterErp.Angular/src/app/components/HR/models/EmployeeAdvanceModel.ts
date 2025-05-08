import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface EmployeeAdvanceModel extends CreatorModel {
    employeeAdvanceId: number | null;
    employeeId: number | null;
    employeeName: string;
    advanceTypeName: string;
    advanceTypeId: number;
    advanceAmount: number;
    paymentAmount: number;
    paymentFromDate: string;
    paymentToDate: string | null;
    isApproved: boolean | null;
    notes: string;
    totalCount: number | null;
}


export interface AdvancePaymentModel extends CreatorModel {
    advancePaymentId: number | null;
    employeeAdvanceId: number;
    employeeId: number | null;
    employeeName: string;
    moneyAmount: number;
    executionDate: string;
    workflowStatusId: number | null;
    advanceTypeName: string;
    advanceTypeId: number;
    advanceAmount: number;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    notes: string;
    totalCount: number | null;
}