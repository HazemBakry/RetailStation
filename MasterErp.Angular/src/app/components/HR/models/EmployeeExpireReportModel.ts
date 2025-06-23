export interface EmployeeExpireReportModel {
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