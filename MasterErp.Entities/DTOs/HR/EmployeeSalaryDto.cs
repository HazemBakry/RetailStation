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
        public int? EmployeCode { get; set; }
        public string EmployeeName { get; set; }
        public int BranchId { get; set; }
        public DateTime ExecutionDate { get; set; }
        public DateTime RequestDate { get; set; }
        public bool? IsPaid { get; set; }
        public bool? IsGossi { get; set; }
        public int? BasicSalary { get; set; }
        public int? ExtraSalary { get; set; }
        public int? WorkNature { get; set; }
        public int? Transportation { get; set; }
        public int? HousingAllowance { get; set; }
        public int? MobileAllowance { get; set; }
        public int? MealAllowance { get; set; }
        public int? OverTime { get; set; }
        public int? Other { get; set; }
        public int? Other2 { get; set; }
        public int? GrossSalary { get; set; }
        public int? DifferenceDays { get; set; }
        public int? DifferenceCosteDays { get; set; }
        public int? TotalGrossSalary { get; set; }
        public int? Gosi { get; set; }
        public int? Absence { get; set; }
        public int? Penalty { get; set; }
        public int? Loan { get; set; }
        public int? SickCost { get; set; }
        public int? TransportDeduct { get; set; }
        public int? HomeDeduct { get; set; }
        public int? OtherDeduct { get; set; }
        public int? TotalDeduct { get; set; }
        public int? NetSalary { get; set; }
        public bool? HRManagerApprove { get; set; }
        public bool? FinanceManagerApprove { get; set; }
        public bool? AuditingApprove { get; set; }
        public bool? ExecutiveManagerApprove { get; set; }
        public bool? GeneralManagerApprove { get; set; }
        public int? VisaPayment { get; set; }
        public int? CashPayment { get; set; }
        public int? TotalSalary { get; set; }
    }
}
