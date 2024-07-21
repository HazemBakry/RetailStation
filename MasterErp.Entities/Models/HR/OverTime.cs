using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    public class OverTime : CreatorModel
    {
        public int OverTimeId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public double NoHours { get; set; }
        public double MoneyAmount { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }

    }
}
