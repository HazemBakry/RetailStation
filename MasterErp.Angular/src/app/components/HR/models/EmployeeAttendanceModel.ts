export interface EmployeeAttendanceModel extends AttendanceModel {
    employeeId: number | null;
    employeeCode: string;
    employeeNameEN: string;
    employeeNameAR: string;
    branchId: number | null;
    branchNameEN: string;
    branchNameAR: string;
    totalCount: number | null;
}

export interface EmployeeAdvancedAttendanceModel {
    employeeId: number | null;
    employeeCode: string;
    employeeNameEN: string;
    employeeNameAR: string;
    branchId: number | null;
    branchNameEN: string;
    branchNameAR: string;
    attendance: AttendanceModel[];
}
export interface AttendanceModel {
    attendanceDate: string | null;
    attendanceStatus: string | null;
    punchDate: string | null;
    punchIn: string | null;
    punchOut: string | null;
    period1_PunchIn: string | null;
    period1_PunchOut: string | null;
    period2_PunchIn: string | null;
    period2_PunchOut: string | null;
    totalWorkSeconds: number | null;
}