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
        public double? BasicSalary { get; set; }
        public double? ExtraSalary { get; set; }
        public double? WorkNature { get; set; }
        public double? Transportation { get; set; }
        public double? HousingAllowance { get; set; }
        public double? MobileAllowance { get; set; }
        public double? MealAllowance { get; set; }
        public double? OverTime { get; set; }
        public double? Other { get; set; }
        public double? Other2 { get; set; }
        public double? GrossSalary { get; set; }
        public int? DifferenceDays { get; set; }
        public double? DifferenceCosteDays { get; set; }
        public double? TotalGrossSalary { get; set; }
        public double? Gosi { get; set; }
        public double? Absence { get; set; }
        public double? Penalty { get; set; }
        public double? Loan { get; set; }
        public double? SickCost { get; set; }
        public double? TransportDeduct { get; set; }
        public double? HomeDeduct { get; set; }
        public double? OtherDeduct { get; set; }
        public double? TotalDeduct { get; set; }
        public double? NetSalary { get; set; }
        public bool? HRManagerApprove { get; set; }
        public bool? FinanceManagerApprove { get; set; }
        public bool? AuditingApprove { get; set; }
        public bool? ExecutiveManagerApprove { get; set; }
        public bool? GeneralManagerApprove { get; set; }
        public double? VisaPayment { get; set; }
        public double? CashPayment { get; set; }
        public double? TotalSalary { get; set; }
    }
}
