using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("MonthlySalaryDetails", Schema = "HR")]
    public class MonthlySalaryDetails : CreatorModel
    {
        [Key]
        public int MonthlySalaryDetailId { get; set; }

        public int MonthlySalaryId { get; set; }

        public int EmployeeId { get; set; }

        public decimal? BasicSalary { get; set; }
        public decimal? ExtraSalary { get; set; }
        public decimal? Transportation { get; set; }
        public decimal? HousingAllowance { get; set; }
        public decimal? MobileAllowance { get; set; }
        public decimal? WorkNature { get; set; }
        public decimal? MealAllowance { get; set; }
        public decimal? Other { get; set; }
        public decimal? GrossSalary { get; set; }
        public decimal? Deductions { get; set; }
        public decimal? Advances { get; set; }
        public decimal? Penalties { get; set; }
        public decimal? Overtime { get; set; }
        public decimal? NetSalary { get; set; }

        public int? PresentDays { get; set; }
        public int? OffDays { get; set; }
        public int? SickDays { get; set; }
        public int? AbsentDays { get; set; }
        public int? TotalWorkingDays { get; set; }

        public string BankAccountNumber { get; set; }
        public string Bank { get; set; }
    }

}
