using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeSalaries", Schema = "HR")]

    public class EmployeeSalary : CreatorModel
    {
        public int EmployeeSalaryId { get; set; }
        public int EmployeeId { get; set; }
        public int? EmployeeContractId { get; set; }
        public double? BasicSalary { get; set; }
        public double? ExtraSalary { get; set; }
        public double? Transportation { get; set; }
        public double? HousingAllowance { get; set; }
        public double? MobileAllowance { get; set; }
        public double? WorkNature { get; set; }
        public double? MealAllowance { get; set; }
        public double? Other { get; set; }
        public double? GrossSalary { get; set; }
        public double? TotalSalary { get; set; }
        public bool? IsActive { get; set; }
        //public Employee Employee { get; set; }
    }
}
