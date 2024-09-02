import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeContractModel } from "./EmployeeContractModel";
import { EmployeeVerificationModel } from "./EmployeeVerificationModel";
import { EmployeeAttachmentModel } from "./EmployeeAttachmentModel";


export interface EmployeeModel extends CreatorModel {
    employeeId: number | null;
    code: number;
    managerId: number | null;
    jobId: number;
    branchId: number;
    statusId: number;
    fullNameAR: string;
    firstNameAR: string;
    fatherNameAR: string;
    grandNameAR: string;
    lastNameAR: string;
    fullNameEN: string;
    firstNameEN: string;
    fatherNameEN: string;
    grandNameEN: string;
    lastNameEN: string;
    bankId: number;
    bankAccountNumber: string;
    birthDate: string;
    birthPlace: string;
    nationalityId: number;
    sponsorId: number | null;

    iqamaNumber: string;
    iqamaJobId: number | null;
    iqamaIssuePlaceId: number | null;
    iqamaIssueDate: string | null;
    iqamaExpireDate: string | null;
    
    iqamaExpireDateHijri: string;
    iqamaIssueDateHijri: string;
    iqamaJobDescription: string;
    religion: string;
    address: string;
    image: string;
    filesPath: string;
    employeeContract: EmployeeContractModel;
    employeeVerification: EmployeeVerificationModel;
    employeeAttachments: EmployeeAttachmentModel;
    imageFile: File;
    attachmentFile: File;

    drivingLicenseNumber: string;
    drivingLicenseIssueDateHijri: string;
    drivingLicenseIssueDate: string | null;
    drivingLicenseExpireDateHijri: string;
    drivingLicenseExpireDate: string | null;
    vehicleId: number | null;
    isChecked: boolean;
}