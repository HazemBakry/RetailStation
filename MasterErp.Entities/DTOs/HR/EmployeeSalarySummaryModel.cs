using Newtonsoft.Json;
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
        public string BankAccountNumber { get; set; }
        public string Bank { get; set; }
        public string JobTitle { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; }


        public int? BranchId { get; set; }
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }        
        public string JobNameEN { get; set; }
        public string JobNameAR { get; set; }


        public double? Deductions { get; set; } = 0;
        public double? Advances { get; set; } = 0;
        public double? Penalties { get; set; } = 0;
        public double? Overtime { get; set; } = 0;

        public double? GrossSalary { get; set; } = 0;
        public double? TotalSalary { get; set; } = 0;
        public double? BasicSalary { get; set; } = 0;
        public double? ExtraSalary { get; set; } = 0;
        public double? Transportation { get; set; } = 0;
        public double? HousingAllowance { get; set; } = 0;
        public double? MobileAllowance { get; set; } = 0;
        public double? WorkNature { get; set; } = 0;
        public double? MealAllowance { get; set; } = 0;
        public double? Other { get; set; } = 0;
        public decimal? DailySalary { get; set; } = 0;
        public decimal? TotalDeductions { get; set; } = 0;
        public decimal? CalculatedSalary { get; set; } = 0;
        public decimal? NetSalary { get; set; } = 0;


        public int? PresentDays { get; set; } = 0;
        public int? OffDays { get; set; } = 0;
        public int? SickDays { get; set; } = 0;
        public int? AbsentDays { get; set; } = 0;

        public int? TotalWorkingDays { get; set; } = 0;

    }
    public class EmployeeSalarySummaryExportModel
    {
        [JsonProperty("Employee Code")]
        public string EmployeeCode { get; set; }

        [JsonProperty("Employee Name")]
        public string EmployeeName { get; set; }

        [JsonProperty("Branch")]
        public string BranchName { get; set; }

        [JsonProperty("Job Title")]
        public string JobTitle { get; set; }

        [JsonProperty("Bank Account")]
        public string BankAccountNumber { get; set; }

        [JsonProperty("Bank Name")]
        public string Bank { get; set; }

        [JsonProperty("Basic Salary")]
        public double? BasicSalary { get; set; }

        [JsonProperty("Extra Salary")]
        public double? ExtraSalary { get; set; }

        [JsonProperty("Transportation")]
        public double? Transportation { get; set; }

        [JsonProperty("Housing Allowance")]
        public double? HousingAllowance { get; set; }

        [JsonProperty("Mobile Allowance")]
        public double? MobileAllowance { get; set; }

        [JsonProperty("Work Nature")]
        public double? WorkNature { get; set; }

        [JsonProperty("Meal Allowance")]
        public double? MealAllowance { get; set; }

        [JsonProperty("Other Allowance")]
        public double? Other { get; set; }

        [JsonProperty("Gross Salary")]
        public double? GrossSalary { get; set; }

        [JsonProperty("Deductions")]
        public double? Deductions { get; set; }

        [JsonProperty("Advances")]
        public double? Advances { get; set; }

        [JsonProperty("Penalties")]
        public double? Penalties { get; set; }

        [JsonProperty("Overtime")]
        public double? Overtime { get; set; }

        [JsonProperty("Net Salary")]
        public decimal? NetSalary { get; set; }

        [JsonProperty("Present Days")]
        public int? PresentDays { get; set; }

        [JsonProperty("Off Days")]
        public int? OffDays { get; set; }

        [JsonProperty("Sick Days")]
        public int? SickDays { get; set; }

        [JsonProperty("Absent Days")]
        public int? AbsentDays { get; set; }

        [JsonProperty("Total Working Days")]
        public int? TotalWorkingDays { get; set; }
    }


    public class MonthlySalaryModel
    {
        public int BranchId { get; set; }
        public int SalaryMonth { get; set; }
        public int SalaryYear { get; set; }
        public string CreatedBy { get; set; }
        public List<MonthlySalaryDetailsModel> EmployeeSalaries { get; set; }
    }

    public class MonthlySalaryDetailsModel
    {
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
