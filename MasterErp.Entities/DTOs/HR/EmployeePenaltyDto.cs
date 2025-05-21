using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
  
    public class EmployeePenaltyDto : CreatorModel
    {
        public int? PenaltyId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int PenaltyTypeId { get; set; }
        public string PenaltyType { get; set; }
        public DateTime PenaltyDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public double DeductionByDays { get; set; }
        public double? DeductionAmount { get; set; }
        public double TotalDeduction { get; set; }
        public string Reason { get; set; }
        public bool IsApproved { get; set; }
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }
    }
}
