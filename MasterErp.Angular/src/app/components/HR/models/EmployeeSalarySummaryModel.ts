export interface EmployeeSalarySummaryModel {
    totalCount: number | null;
    employeeId: number | null;
    employeeCode: string;
    bankAccountNumber: string;
    employeeNameEN: string;
    employeeNameAR: string;
    branchId: number | null;
    branchNameEN: string;
    branchNameAR: string;
    totalSalary: number | null;
    dailySalary: number | null;
    calculatedSalary: number | null;
    netSalary: number | null;
    presentDays: number | null;
    offDays: number | null;
    sickDays: number | null;
    absentDays: number | null;
    effectiveWorkingDays: number | null;
    deductions: number | null;
    advances: number | null;
}