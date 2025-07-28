using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeFinancialCustodyModel:CreatorModel
    {
        public int? EmployeeFinancialCustodyId { get; set; }
        public int? EmployeeId { get; set; }
        public int FinancialCustodyTypeId { get; set; }
        public decimal MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public int? BranchId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string Notes { get; set; }
        public string FinancialCustodyTypeNameEN { get; set; }
        public string FinancialCustodyTypeNameAR { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }        
        public string BranchNameEN { get; set; }
        public string BranchNameAR { get; set; }       
        public string JobNameEN { get; set; }
        public string JobNameAR { get; set; }

        public int? TotalCount { get; set; }
    }
}
