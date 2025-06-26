using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeOverTimeDto : CreatorModel
    {
        public int? OverTimeId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public double NoHours { get; set; }
        public double MoneyAmount { get; set; }
        public double OvertimeRatio { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; } = (int)HRWorkflowStatus.Pending;
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }
    }
}
