using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeVacation
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int VacationId { get; set; }
        public string AlternativeAvailable { get; set; }
        public string AlternativeEmployee { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime? LastDayWork { get; set; }
        public int Period { get; set; }
    }
}
