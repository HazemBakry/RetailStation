import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeModel } from "./EmployeeModel";


export interface EmployeeVerificationModel extends CreatorModel {
    employeeVerificationId: number;
    borderEntryNumber: string;
    passportNumber: string;
    borderEntryDate: string | null;
    arrivalPort: string;
    visaNumber: string;
    visaIssueDate: string | null;
    passportExpireDate: string | null;
    passportIssuanceDate: string | null;
    passportIssuancePlace: string;
    employeeId: number;
    employee: EmployeeModel;
}