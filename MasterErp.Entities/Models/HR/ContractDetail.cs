using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("ContractDetails", Schema = "HR")]

    public class ContractDetail
    {
        public int ContractDetailId { get; set; }
        public int EmployeeId { get; set; }
        public int? ContractId { get; set; }
        public double BasicSalary { get; set; }
        public double? ExtraSalary { get; set; }
        public double? Transportation { get; set; }
        public double? HousingAllowance { get; set; }
        public double? MobileAllowance { get; set; }
        public double? WorkNature { get; set; }
        public double? MealAllowance { get; set; }
        public double? Other { get; set; }
        public double? GrossSalary { get; set; }
        public double? TotalSalary { get; set; }
    }
}