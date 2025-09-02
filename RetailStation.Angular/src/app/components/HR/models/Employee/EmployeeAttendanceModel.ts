interface EmployeeAttendance {
  employeeId: number | null;
  employeeCode: string;
  employeeNameEN: string;
  employeeNameAR: string;
  branchId: number | null;
  branchNameEN: string;
  branchNameAR: string;
  punchDate: Date | null;
  punchIn?: Date | null; 
  punchOut?: Date | null;
  period1_PunchIn: Date | null;
  period1_PunchOut: Date | null;
  period2_PunchIn: Date | null;
  period2_PunchOut: Date | null;
  totalWorkSeconds: number | null;
}