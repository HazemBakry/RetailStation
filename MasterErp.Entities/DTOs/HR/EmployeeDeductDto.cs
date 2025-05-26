using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeDeductDto : CreatorModel
    {
        public int? DeductId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int DeductTypeId { get; set; }
        public string DeductTypeName { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; } = (int)HRWorkflowStatus.Pending; public string Notes { get; set; }
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }


    }
}
