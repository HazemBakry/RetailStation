using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class AdvancePaymentModel : CreatorModel
    {
        public int? AdvancePaymentId { get; set; }
        public int EmployeeAdvanceId { get; set; }
        public int? EmployeeId { get; set; }
        public int? AdvanceNumber { get; set; }
        public string EmployeeName { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string AdvanceTypeNameEN { get; set; }
        public string AdvanceTypeNameAR { get; set; }
        public int AdvanceTypeId { get; set; }
        public double AdvanceAmount { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public string Notes { get; set; }
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }

    }
}
