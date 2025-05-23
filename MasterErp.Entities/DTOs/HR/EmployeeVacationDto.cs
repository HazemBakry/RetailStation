using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeVacationDto : CreatorModel
    {
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int? VacationId { get; set; }
        public int VacationTypeId { get; set; }
        public string VacationType { get; set; }
        public int? AlternativeEmployeeId { get; set; }
        public string AlternativeEmployeeName { get; set; }
        public string AlternativeEmployee { get; set; }
        public string Notes { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime LastDayWork { get; set; }
        public int? Period { get; set; }
        public bool? IsApproved { get; set; }
        public bool IsAlternativeAvailable { get; set; }
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }
    }
}
