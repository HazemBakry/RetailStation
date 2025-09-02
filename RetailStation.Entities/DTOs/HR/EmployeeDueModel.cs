using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.HR
{
    public class DuesPreparationModel
    {
        public int DueTypeId { get; set; }
        public int? VacationId { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public DateTime? LastJoinDate { get; set; }
        public DateTime? JoinDate { get; set; }
        public int? ContractVacationPeriod { get; set; }
        public DateTime? VacationStartDate { get; set; }
        public DateTime? VacationEndDate { get; set; }
        public int? CurrentVacationPeriod { get; set; }
        public int? TotalDuesMonths { get; set; }
        public int? TotalDuesDays { get; set; }
        public int? LastPaidSalaryMonth { get; set; }
        public int? LastPaidSalaryYear { get; set; }
        public int? BranchId { get; set; }
        public double? BasicSalary { get; set; }
        public double? SalaryDues { get; set; }
        public double? VacationDues { get; set; }
        public double? HomeAllowance { get; set; }
        public double? Advances { get; set; }
        public double? Covenant { get; set; }
        public double? FlightTicketDues { get; set; }
        public string OtherDeductionDesc { get; set; }
        public double? OtherDeductionValue { get; set; }
        public bool? IncludeFlightTicket { get; set; }

        public bool? IncludeSalary { get; set; }
        public List<SalaryDuesMonthModel> SalaryDuesMonths { get; set; }
        public double? EndOfServiceDues { get; set; }
        public double? TotalDueAmount { get; set; }
        public void CalcTotalDues(DueType DueType)
        {
            if (IncludeFlightTicket != true)
                FlightTicketDues = 0;
            if (IncludeSalary != true)
                SalaryDues = 0;

            TotalDueAmount = (SalaryDues.GetValueOrDefault() +
                (DueType == DueType.EndOfContract ? EndOfServiceDues : (VacationDues.GetValueOrDefault() + HomeAllowance.GetValueOrDefault())) +
                FlightTicketDues.GetValueOrDefault()) - (Advances.GetValueOrDefault());
        }

    }
    public class SalaryDuesMonthModel
    {
        public int SalaryMonth { get; set; }
        public int SalaryYear { get; set; }

    }
    public class EmployeeDueModel : CreatorModel
    {
        public int? EmployeeDueId { get; set; }
        public int? EmployeeCode { get; set; }
        public int EmployeeId { get; set; }
        public int DueTypeId { get; set; }
        public int NoMonths { get; set; }
        public int NoDays { get; set; }
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public string JobNameEN { get; set; }
        public string JobNameAR { get; set; }
        public string DueTypeNameEN { get; set; }
        public string DueTypeNameAR { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime? LastJoinDate { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public int? SalaryMonth { get; set; }
        public int? SalaryYear { get; set; }
        public bool AddSalaryToDue { get; set; }
        public string? Notes { get; set; }
        public double? VacationDues { get; set; }
        public double? EndOfServiceDues { get; set; }
        public double? CurrentMonthSalary { get; set; }
        public double? HomeAllowance { get; set; }
        public double? Advances { get; set; }
        public double? NetAmount { get; set; }
        public int? WorkflowStatusId { get; set; }

        public double? TotalDues { get; set; }
        public double? TotalDeduction { get; set; }
        public int? TotalCount { get; set; }

        public double? SalaryDues { get; set; }
        public double? FlightTicketDues { get; set; }
        public string? OtherDeductionDesc { get; set; }
        public double? OtherDeductionValue { get; set; }

        public int? VacationId { get; set; }

        public double? TotalDuesAmount { get; set; }

    }

    public class EmployeeDueExportModel
    {
        [JsonProperty("Employee Code")]
        public int? EmployeeCode { get; set; }

        [JsonProperty("Employee Name")]
        public string EmployeeName { get; set; }

        [JsonProperty("Job Title")]
        public string JobName { get; set; }

        [JsonProperty("Branch")]
        public string BranchName { get; set; }


        [JsonProperty("Due Type")]
        public string DueType { get; set; }
        [JsonProperty("Due Months")]
        public int NoMonths { get; set; }
        [JsonProperty("Due Days")]
        public int NoDays { get; set; }

        [JsonProperty("Join Date")]
        public string JoinDate { get; set; }
        [JsonProperty("Last Join Date")]
        public string LastJoinDate { get; set; }
        [JsonProperty("Execution Date")]
        public string ExecutionDate { get; set; }

        [JsonProperty("Notes")]
        public string Notes { get; set; }
        [JsonProperty("Vacation Dues")]
        public string VacationDues { get; set; }
        [JsonProperty("End Of Service Dues")]
        public string EndOfServiceDues { get; set; }
        [JsonProperty("Salary Dues")]
        public string SalaryDues { get; set; }
        [JsonProperty("Home Allowance")]
        public string HomeAllowance { get; set; }
        [JsonProperty("Advances")]
        public string Advances { get; set; }
        [JsonProperty("Flight Ticket Dues")]
        public string FlightTicketDues { get; set; }

        [JsonProperty("Net Amount")]
        public string NetAmount { get; set; }
        [JsonProperty("Total Dues Amount")]
        public string TotalDuesAmount { get; set; }
        [JsonProperty("Total Deduction")]
        public string TotalDeduction { get; set; }

        [JsonProperty("Workflow Status")]
        public string WorkflowStatus { get; set; }


    }
}
