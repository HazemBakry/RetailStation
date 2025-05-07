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