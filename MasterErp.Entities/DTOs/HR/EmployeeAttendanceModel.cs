using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeAttendanceModel : AttendanceModel
    {
        public int? EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; } 
        public int? BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }
        public int? TotalCount { get; set; }
    }
    public class EmployeeAdvancedAttendanceModel
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; } 
        public int BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }
        public List<AttendanceModel> Attendance { get; set; }
        public int SickLeaveCount => GetStatusCount("S");
        public int PresentCount => GetStatusCount("P");
        public int AbsentCount => GetStatusCount("A");
        public int ExcusedCount => GetStatusCount("E");
        public int OffCount => GetStatusCount("O");

        private int GetStatusCount(string code)
        {
            return Attendance?.Count(x => x.AttendanceStatusCode == code) ?? 0;
        }

        public int? TotalCount { get; set; }


    }
    public class AttendanceModel
    {
        public DateTime? AttendanceDate { get; set; }
        public DateTime? PunchDate { get; set; }
        public DateTime? PunchIn { get; set; } 
        public DateTime? PunchOut { get; set; }
        public DateTime? Period1_PunchIn { get; set; }
        public DateTime? Period1_PunchOut { get; set; }
        public DateTime? Period2_PunchIn { get; set; }
        public DateTime? Period2_PunchOut { get; set; }
        public int? TotalWorkSeconds { get; set; }
        public double TotalWorkHours =>  TotalWorkSeconds.HasValue  ? Math.Round(TotalWorkSeconds.Value / 3600.0, 2) : 0;
        public bool? IsSickLeave { get; set; }
        public bool? IsVacation { get; set; }
        public string AttendanceStatusCode => SetAttendanceStatusCode();
        private string SetAttendanceStatusCode()
        {
            if (AttendanceDate > DateTime.Now)
                return "-";
            if (IsSickLeave == true)
                return "S"; // Sick Leave

            if (IsVacation == true)
                return "E"; // Excused

            if (PunchIn.HasValue && PunchOut.HasValue && TotalWorkHours > 7)
                return "P"; // Present

            if (!PunchIn.HasValue && !PunchOut.HasValue && IsSickLeave == false && IsVacation == false)
                return "A"; // Absent

            return "O"; // Off (e.g. only one punch, partial or unclear attendance)
        }

    }

}
