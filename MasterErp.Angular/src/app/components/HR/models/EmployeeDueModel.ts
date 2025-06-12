export interface EmployeeDueModel {
    employeeId: number | null;
    employeeCode: string;
    employeeNameEN: string;
    employeeNameAR: string;
    branchId: number | null;
    branchNameEN: string;
    branchNameAR: string;
    jobTitle: string;
    jobNameEN: string;
    jobNameAR: string;
    totalDueAmount: number | null;
    dueDate: Date | null;
    dueDescription: string;

    startWorkingDate: Date | null;
    lastWorkingDate: Date | null;
    executionDate: Date | null;
    salaryMonth: number | null;
    salaryYear: number | null;
    addSalaryToDue: boolean | null;
    notes: string | null;

    vacationDues: number | null;
    endOfServiceDues: number | null;
    currentMonthSalary: number | null;
    homeAllowance: number | null;
    advances: number | null;
    netAmount : number | null; 

    dueTypeId: number | null;
    dueTypeNameEN: string;
    dueTypeNameAR: string;
}  