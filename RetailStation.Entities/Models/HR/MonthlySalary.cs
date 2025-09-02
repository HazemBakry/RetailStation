using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("MonthlySalary", Schema = "HR")]
    public class MonthlySalary : CreatorModel
    {
        [Key]
        public int MonthlySalaryId { get; set; }

        public int BranchId { get; set; }
        public int SalaryMonth { get; set; }
        public int SalaryYear { get; set; }

        public int? TotalEmployees { get; set; }
        public decimal? TotalBasicSalary { get; set; }
        public decimal? TotalTransportation { get; set; }
        public decimal? TotalHousingAllowance { get; set; }
        public decimal? TotalMobileAllowance { get; set; }
        public decimal? TotalMealAllowance { get; set; }
        public decimal? TotalExtraSalary { get; set; }
        public decimal? TotalOtherAllowance { get; set; }
        public decimal? TotalGrossSalary { get; set; }
        public decimal? TotalDeductions { get; set; }
        public decimal? TotalAdvances { get; set; }
        public decimal? TotalPenalties { get; set; }
        public decimal? TotalOvertime { get; set; }
        public decimal? TotalNetSalary { get; set; }

        public int? JournalEntryId { get; set; }

    }

}
