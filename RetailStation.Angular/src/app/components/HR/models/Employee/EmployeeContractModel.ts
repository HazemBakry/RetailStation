import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeModel } from "./EmployeeModel";

export interface EmployeeContractModel extends EmployeeContractDetailsModel, CreatorModel {
    contractId: number | null;
    startDate: string;
    endDate: string;
    joinDate: string | null;
    lastJoinDate: string | null;
    contractPeriodYears: number;
    vacationPeriodDays: number | null;
    vacationDate: string | null;
    isGossi: boolean;
    // basicSalary: number;
    // extraSalary: number;
    // transportation: number;
    // housingAllowance: number;
    // mobileAllowance: number;
    // workNature: number;
    // mealAllowance: number;
    // other: number | null;
    // totalSalary: number | null;
    employeeId: number | null;
    branchId: number | null;
    employee: EmployeeModel | null;
}


export interface EmployeeContractDetailsModel extends CreatorModel {
    contractId: number | null;
    contractDetailId: number | null;
    employeeId: number | null;
    basicSalary: number;
    extraSalary: number;
    transportation: number;
    housingAllowance: number;
    mobileAllowance: number;
    workNature: number;
    mealAllowance: number;
    other: number | null;
    isMealAdded?: boolean | null;
    totalSalary: number | null;
}