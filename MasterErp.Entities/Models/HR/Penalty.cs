using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    public class Penalty : CreatorModel
    {
        public int PenaltyId { get; set; }
        public int EmployeeId { get; set; }
        public int PenaltyTypeId { get; set; }
        public DateTime PenaltyDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public double DeductionByDays { get; set; }
        public double DeductionAmount { get; set; }
        public double TotalDeduction { get; set; }
        public string Reason { get; set; }
        public bool IsApproved { get; set; }

    }
}
