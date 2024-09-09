using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeSalaryDto
    {
        public int? SalaryId { get; set; }
        public int EmployeeId { get; set; }
        public int BranchId { get; set; }
        public DateTime ExecutionDate { get; set; }
        public DateTime RequestDate { get; set; }
        public bool? IsPaid { get; set; }
        public float? BasicSalary { get; set; }
        public float? ExtraSalary { get; set; }
        public float? WorkNature { get; set; }
        public float? Transport { get; set; }
        public float? Home { get; set; }
        public float? Mobile { get; set; }
        public float? Food { get; set; }
        public float? OverTime { get; set; }
        public float? Other { get; set; }
        public float? Other2 { get; set; }
        public float? GrossSalary { get; set; }
        public float? DifferenceDays { get; set; }
        public float? DifferencDifferenceCosteDays { get; set; }
        public float? TotalGrossSalary { get; set; }
        public float? Gosi { get; set; }
        public float? Absence { get; set; }
        public float? Penalty { get; set; }
        public float? Loan { get; set; }
        public float? SickCost { get; set; }
        public float? TransportDeduct { get; set; }
        public float? HomeDeduct { get; set; }
        public float? OtherDeduct { get; set; }
        public float? TotalDeduct { get; set; }
        public float? NetSalary { get; set; }
        public bool? HRManagerApprove { get; set; }
        public bool? FinanceManagerApprove { get; set; }
        public bool? AuditingApprove { get; set; }
        public bool? ExecutiveManagerApprove { get; set; }
        public bool? GeneralManagerApprove { get; set; }
        public float? VisaPayment { get; set; }
        public float? CashPayment { get; set; }
    }
}
