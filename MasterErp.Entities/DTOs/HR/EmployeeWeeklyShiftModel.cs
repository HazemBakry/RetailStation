using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeWeeklyShiftModel : CreatorModel
    {
        public int? EmployeeWeeklyShiftId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan? ShiftOneFrom { get; set; }
        public TimeSpan? ShiftOneTo { get; set; }
        public TimeSpan? ShiftTwoFrom { get; set; }
        public TimeSpan? ShiftTwoTo { get; set; }
        public string ShiftType { get; set; } = "Working";
        public bool IsDayOff { get; set; }
        public bool IsWeekend { get; set; }
        public string Notes { get; set; }

        public string EmployeeCode { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; }
        public int? BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }
        public int? TotalCount { get; set; }
    }
}
