import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface EmployeeAdvanceModel extends CreatorModel {
    employeeAdvanceId: number | null;
    employeeId: number | null;
    employeeName: string;
    advanceTypeNameEN: string;
    advanceTypeNameAR: string;
    advanceTypeId: number;
    advanceAmount: number;
    paymentAmount: number;
    paymentFromDate: string;
    paymentToDate: string | null;
    workflowStatusId: number | null;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    isApproved: boolean | null;
    notes: string;
    totalPaid: number | null;
    totalRemaining: number | null;
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
    advanceTypeNameEN: string;
    advanceTypeNameAR: string;
    advanceTypeId: number;
    advanceAmount: number;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    notes: string;
    totalCount: number | null;
}