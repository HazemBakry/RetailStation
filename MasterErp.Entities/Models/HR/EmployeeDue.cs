using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeDues", Schema = "HR")]
    public class EmployeeDue : CreatorModel
    {
        public int EmployeeDueId { get; set; }

        public int EmployeeId { get; set; }
        public int DueTypeId { get; set; }
        public int NoMonths { get; set; }
        public int NoDays { get; set; }

        public DateTime? JoinDate { get; set; }
        public DateTime? LastJoinDate { get; set; }
        public DateTime? ExecutionDate { get; set; }

        public string Notes { get; set; }

        public double? VacationDues { get; set; }
        public double? EndOfServiceDues { get; set; }
        public double? SalaryDues { get; set; }
        public double? HomeAllowance { get; set; }
        public double? Advances { get; set; }
        public double? FlightTicketDues { get; set; }
        public double? NetAmount { get; set; }

        public int? VacationId { get; set; }
        public int? WorkflowStatusId { get; set; }

        public double? TotalDuesAmount { get; set; }
        public double? TotalDeduction { get; set; }

    }
}
