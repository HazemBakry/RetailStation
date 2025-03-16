using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using static Azure.Core.HttpHeader;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeDues", Schema = "HR")]
    public class EmployeeDue
    {
        public int EmployeeDueId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? StartWorkingDate { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public int? DueTypeId { get; set; }
        public int? NoMonths { get; set; }
        public int? NoDays { get; set; }
        public double? ActualDuration { get; set; }
        public double? RewardPaid { get; set; }
        public double? BasicSalary { get; set; }
        public double? TotalDues { get; set; }
        public double? MonthlySalary { get; set; }
        public double? HomeAllowance { get; set; }
        public double? Loans { get; set; }
        public DateTime? SalaryMonth { get; set; }
        public int? WorkDuration { get; set; }
        public double? Gossi { get; set; }
        public double? TotalDeduction { get; set; }
        public double? NetAmount { get; set; }
        public string Notes { get; set; }
        public int? GroupId { get; set; }
        public bool? IsPrinted { get; set; }

    }
}
