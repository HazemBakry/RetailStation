using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeAttendanceModel
    {
        public int? EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; } 
        public int? BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }
        public DateTime? PunchDate { get; set; }
        public DateTime? PunchIn { get; set; } 
        public DateTime? PunchOut { get; set; }
        public DateTime? Period1_PunchIn { get; set; }
        public DateTime? Period1_PunchOut { get; set; }
        public DateTime? Period2_PunchIn { get; set; }
        public DateTime? Period2_PunchOut { get; set; }
        public int? TotalWorkSeconds { get; set; }
        public int? TotalCount { get; set; }
    }
}
