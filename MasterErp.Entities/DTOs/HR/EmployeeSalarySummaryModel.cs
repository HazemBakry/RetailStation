using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeSalarySummaryModel
    {
        public int? TotalCount { get; set; }


        public int? EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; }


        public int? BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }


        public double? TotalSalary { get; set; }
        public decimal? DailySalary { get; set; }
        public decimal? CalculatedSalary { get; set; }
        public decimal? NetSalary { get; set; }


        public int? PresentDays { get; set; }
        public int? OffDays { get; set; }
        public int? SickDays { get; set; }
        public int? AbsentDays { get; set; }

        public int? EffectiveWorkingDays { get; set; }

        public double? Deductions { get; set; }
        public double? Advances { get; set; }
    }

}
