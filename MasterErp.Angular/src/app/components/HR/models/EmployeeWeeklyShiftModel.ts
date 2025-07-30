import { CreatorModel } from "../../Shared/models/CreatorModel";

export interface EmployeeWeeklyShiftModel extends CreatorModel {
    employeeWeeklyShiftId: number | null;
    employeeId: number;
    shiftDate: string;
    shiftOneFrom: string | null;
    shiftOneTo: string | null;
    shiftTwoFrom: string | null;
    shiftTwoTo: string | null;
    shiftType: string;
    isDayOff: boolean;
    isWeekend: boolean;
    notes: string;
    employeeCode?: string;
    employeeNameEN?: string;
    employeeNameAR?: string;
    branchId?: number | null;
    branchNameEN?: string;
    branchNameAR?: string;
}