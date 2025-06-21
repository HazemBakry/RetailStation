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
    dueDate: string| null;
    dueDescription: string;

    startWorkingDate: string| null;
    lastWorkingDate: string| null;
    executionDate: string| null;
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