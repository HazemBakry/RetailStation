
export interface SaveEmployeeModel {
    employee: Employee;
    employeeContract: EmployeeContract;
    employeeSalary: EmployeeSalary;
}

export interface Employee {
    employeeId?: number;
    code?: number;
    iqamaNumber?: string;
    jobId?: number;///
    iqamaJobId?: number;///
    branchId?: number;///
    fullNameAR?: string;///
    firstNameAR?: string;///
    fatherNameAR?: string;///
    grandNameAR?: string;///
    lastNameAR?: string;///
    fullNameEN?: string;///
    firstNameEN?: string;///
    fatherNameEN?: string;///
    grandNameEN?: string;///
    lastNameEN?: string;///
    statusId?: number;
    bankId?: number;///
    bankAccount?: string;///
    nationalityId?: number;///
    birthDate?: string;///
    birthPlace?: string;///
    sponsorId?: number;///
    iqamaIssuePlaceId?: number | null;///
    iqamaExpireDate?: string | null;///
    iqamaExpireDateHijri?: string;
    iqamaIssueDate?: string | null;///
    iqamaIssueDateHijri?: string;
    iqamaJobDescription?: number | null;
    visaNumber?: string;///
    visaIssueDate?: string | null;///
    passportNumber?: string;///
    passportExpireDate?: string | null;///
    passportIssuanceDate?: string | null;///
    passportIssunacePlace?: string;///
    drivingLicenseNumber?: string;///
    drivingLicenseIssueHijri?: string;
    drivingLicenseIssue?: string | null;///
    drivingLicenseExpireHijri?: string;
    drivingLicenseExpire?: string | null;///
    vehicleId?: number | null;
    joinDate?: string;///
    lastJoinDate?: string;///
    contractPeriod?: number;
    religion?: string;///
    borderEntryNumber?: string;///
    borderEntryDate?: string;///
    arrivalPort?: string;///
    address?: string;///
    vacationPeriods?: number | null;
    vacationDates?: number | null;
    isGossi?: boolean;///
    image?: string;
    filesPath?: string;
    insertUser?: number | null;
    updateUser?: number | null;
    insertDate?: string | null;///
    updateDate?: string | null;
}

export interface EmployeeContract {
    employeeContractID?: number;
    employeeID?: number;
    noYears?: number;///
    startDate?: string;
    endDate?: string;
    vacationEvery?: number;///
    vacationDays?: number;///
}

export interface EmployeeSalary {
    employeeSalaryId?: number;
    basicSalary?: number;///
    extraSalary?: number;///
    transport?: number;///
    home?: string;///
    mopile?: string;///
    workNature?: string;///
    food?: string;///
    other?: string;///
    totalSalary?: number;///
}