using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{

    public class EmployeeAdvanceModel : CreatorModel
    {
        public int? EmployeeAdvanceId { get; set; }
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string AdvanceTypeNameEN { get; set; }
        public string AdvanceTypeNameAR { get; set; }
        public int AdvanceTypeId { get; set; }
        public double AdvanceAmount { get; set; }
        public double PaymentAmount { get; set; }
        public DateTime PaymentFromDate { get; set; }
        public DateTime? PaymentToDate { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; } = (int)HRWorkflowStatus.Pending;
        public string Notes { get; set; }
        public double? TotalPaid { get; set; }
        public double? TotalRemaining { get; set; }
        public int? TotalCount { get; set; }


    }
}
