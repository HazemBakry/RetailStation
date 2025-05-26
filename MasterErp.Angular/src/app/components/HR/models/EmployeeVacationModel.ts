export interface EmployeeVacationModel {
    employeeId: number;
    employeeName: string;
    vacationId: number;
    vacationTypeId: number;
    isAlternativeAvailable: boolean;
    vacationType: string;
    notes: string;
    alternativeEmployeeId: number | null;
    alternativeEmployeeName: string;
    alternativeEmployee: string;
    fromDate: string | null;
    toDate: string | null;
    lastDayWork: string | null;
    period: number | null;
    workflowStatusId: number | null;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    totalCount: number | null;
}