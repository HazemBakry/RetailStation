using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
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
        public bool? IncludeFlightTicket { get; set; }
        
        public bool? IncludeSalary { get; set; }
        public List<SalaryDuesMonthModel> SalaryDuesMonths { get; set; }
        public double? EndOfServiceDues { get; set; }
        public double? TotalDueAmount { get; set; }
        public void CalcTotalDues()
        {
            if (IncludeFlightTicket !=true)
                FlightTicketDues = 0;
            if (IncludeSalary != true)
                SalaryDues = 0;

            TotalDueAmount=(SalaryDues.GetValueOrDefault() + VacationDues.GetValueOrDefault() + HomeAllowance.GetValueOrDefault() + FlightTicketDues.GetValueOrDefault()) - (Advances.GetValueOrDefault());
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
        public string DueNameEN { get; set; }
        public string DueNameAR { get; set; }
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

        public int? VacationId { get; set; }

        public double? TotalDuesAmount { get; set; }

    }


}
