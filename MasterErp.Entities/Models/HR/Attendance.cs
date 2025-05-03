using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("Attendance", Schema = "HR")]
    public class Attendance : CreatorModel
    {
        public int AttendanceID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime RequestDate { get; set; }
        public string Type { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public double NoOfDays { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
