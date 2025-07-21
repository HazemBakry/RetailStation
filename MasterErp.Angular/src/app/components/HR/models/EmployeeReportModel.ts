export interface EmployeeReportModel {
    employeeId: number;
    employeeCode: number;
    iqamaNumber: string;
    employeeNameAR: string;
    employeeNameEN: string;
    statusId: number;
    employeeStatusNameEN: string;
    employeeStatusNameAR: string;
    email: string;
    nationalityNameAR: string;
    nationalityNameEN: string;
    sponsorNameAR: string;
    sponsorNameEN: string;
    birthDate: string | null
    jobNameAR: string;
    jobNameEN: string;
    branchNameAR: string;
    branchNameEN: string;
    joinDate: string | null;
    contractPeriod: number | null;
    socialStatusId: number | null;
    socialStatusNameAR: string;
    socialStatusNameEN: string;
    address: string;
    phone: string;
    expiryDate: string | null;
    notes: string | null;

}
export interface SalaryAnnualIncreaseModel extends EmployeeReportModel {
    oldSalary: number;
    oldSalaryDate: string | null;
    newSalary: number;
    newSalaryDate: string | null;

}

export interface SalaryHistoryModel {
    employeeId: number | null;
    employeeNameAR: string;
    employeeNameEN: string;
    basicSalary: number;
    extraSalary: number | null;
    transportation: number | null;
    housingAllowance: number | null;
    mobileAllowance: number | null;
    workNature: number | null;
    mealAllowance: number | null;
    other: number | null;
    grossSalary: number | null;
    totalSalary: number | null;
    createdDate: string | null;
}