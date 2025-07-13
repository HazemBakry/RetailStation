

export interface EmployeeDueModel {




    employeeId: number | null;
    employeeDueId: number | null;
    employeeCode: string;
    employeeNameEN: string;
    employeeNameAR: string;
    branchId: number | null;
    branchNameEN: string;
    branchNameAR: string;
    jobTitle: string;
    jobNameEN: string;
    jobNameAR: string;
    totalDuesMonths: number | null;
    totalDuesDays: number | null;
    totalDueAmount: number | null;
    dueDate: string | null;
    dueDescription: string;

    joinDate: string | null;
    lastJoinDate: string | null;
    executionDate: string | null;
    salaryMonth: number | null;
    salaryYear: number | null;
    addSalaryToDue: boolean | null;
    notes: string | null;

    vacationDues: number | null;
    endOfServiceDues: number | null;
    currentMonthSalary: number | null;
    homeAllowance: number | null;
    advances: number | null;
    netAmount: number | null;

    dueTypeId: number | null;
    dueTypeNameEN: string;
    dueTypeNameAR: string;
    includeFlightTicket: boolean;
    flightTicketAmount: number;
    covenant: number;
    workflowStatusId: number;
    noMonths: number;
    noDays: number;
    totalDeduction: number | null;
    totalCount: number | null;
    salaryDues: number | null;
    flightTicketDues: number | null;
    vacationId: number | null;
    totalDuesAmount: number | null;
}

export interface DuesPreparationModel {
    lastJoinDate: string | null;
    joinDate: string | null;
    contractVacationPeriod: number | null;
    vacationStartDate: string | null;
    vacationEndDate: string | null;
    currentVacationPeriod: number | null;
    lastPaidSalaryMonth: number | null;
    lastPaidSalaryYear: number | null;
    branchId: number | null;
    basicSalary: number | null;
    vacationDues: number | null;
    homeAllowance: number | null;
    totalDueAmount: number | null;
}

export interface DuesPreparationModel {
    dueTypeId: number;
    vacationId: number;
    executionDate: string | null;
    lastJoinDate: string | null;
    joinDate: string | null;
    contractVacationPeriod: number | null;
    vacationStartDate: string | null;
    vacationEndDate: string | null;
    currentVacationPeriod: number | null;
    lastPaidSalaryMonth: number | null;
    lastPaidSalaryYear: number | null;
    branchId: number | null;
    basicSalary: number | null;
    salaryDues: number | null;
    vacationDues: number | null;
    homeAllowance: number | null;
    advances: number | null;
    covenant: number | null;
    flightTicketDues: number | null;
    includeFlightTicket: boolean | null;
    includeSalary: boolean | null;
    salaryDuesMonths: SalaryDuesMonthModel[];
    endOfServiceDues: number | null;

    totalDuesMonths: number | null;
    totalDuesDays: number | null;
    totalDueAmount: number | null;
}

export interface SalaryDuesMonthModel {
    salaryMonth: number;
    salaryYear: number;
}