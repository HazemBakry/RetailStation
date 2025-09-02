import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";
import { EmployeeModel } from "./EmployeeModel";
import { AttachmentModel } from "src/app/components/Shared/models/AttachmentModel";

export interface EmployeeAttachmentModel extends CreatorModel {
    employeeAttachmentId: number | null;
    attachments: AttachmentModel[];
    files: File[];
    employeeId: number | null;
    employee: EmployeeModel;
}