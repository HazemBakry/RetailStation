import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeModel } from "./EmployeeModel";

export interface EmployeeContractModel extends CreatorModel {
    employeeContractId: number | null;
    joinDate: string;
    lastJoinDate: string;
    contractPeriodYears: number;
    vacationPeriodDays: number | null;
    vacationDate: string | null;
    isGossi: boolean;
    basicSalary: number;
    extraSalary: number;
    transportation: number;
    housingAllowance: number;
    mobileAllowance: number;
    workNature: number;
    mealAllowance: number;
    other: number | null;
    totalSalary: number | null;
    employeeId: number | null;
    employee: EmployeeModel | null;
}