import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeModel } from "./EmployeeModel";


export interface EmployeeExtraDataModel extends CreatorModel {
    employeeExtraDataId: number | null;
    drivingLicenseNumber: string;
    drivingLicenseIssueHijri: string;
    drivingLicenseIssue: string | null;
    drivingLicenseExpireHijri: string;
    drivingLicenseExpire: string | null;
    vehicleId: number | null;
    employeeId: number;
    employee: EmployeeModel;
}