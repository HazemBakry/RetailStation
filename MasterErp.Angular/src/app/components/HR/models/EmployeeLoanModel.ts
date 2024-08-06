import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface EmployeeLoanModel extends CreatorModel {
    loanId: number | null;
    employeeId: number | null;
    employeeName: string;
    loanTypeName: string;
    loanTypeId: number;
    loanAmount: number;
    paymentAmount: number;
    paymentFromDate: string;
    paymentToDate: string | null;
    isApproved: boolean | null;
    notes: string;
    totalCount: number | null;
}