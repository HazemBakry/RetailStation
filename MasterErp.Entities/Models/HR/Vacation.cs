using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    public class Vacation : CreatorModel
    {
        public int VacationId { get; set; }
        public int EmployeeId { get; set; }
        public bool IsAlternativeAvailable { get; set; }
        public int? AlternativeEmployeeId { get; set; }
        public int VacationTypeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime LastDayWork { get; set; }
        public int? Period { get; set; }

        public int? VacationMonth { get; set; }
        public bool? IsApproved { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? LastJoinDate { get; set; }
        public string Notes { get; set; }

    }
}
