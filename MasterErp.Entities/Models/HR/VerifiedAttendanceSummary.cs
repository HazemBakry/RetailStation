using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("VerifiedAttendanceSummary", Schema = "HR")]
    public class VerifiedAttendanceSummary:CreatorModel
    {
        [Key]
        public int VerifiedAttendanceSummaryId { get; set; }
        public int EmployeeId { get; set; }
        public int BranchId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public int SickLeaveCount { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int ExcusedCount { get; set; }
        public int OffCount { get; set; }
    }

}
