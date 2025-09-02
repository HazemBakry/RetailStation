using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("EmployeeWeeklyShifts", Schema = "HR")]
    public class EmployeeWeeklyShift:CreatorModel
    {
        [Key]
        public int EmployeeWeeklyShiftId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan? ShiftOneFrom { get; set; }

        [Column(TypeName = "time")] 
        public TimeSpan? ShiftOneTo { get; set; }
        public TimeSpan? ShiftTwoFrom { get; set; }
        public TimeSpan? ShiftTwoTo { get; set; }
        public string ShiftType { get; set; } = "Working";
        public bool IsDayOff { get; set; } 
        public bool IsWeekend { get; set; }
        public string Notes { get; set; }
    }
}
