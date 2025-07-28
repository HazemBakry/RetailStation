using MasterErp.Entities.Models;
using Newtonsoft.Json;
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
        public string EmployeeNameEN { get; set; }
        public string EmployeeNameAR { get; set; }
        public int? EmployeeCode { get; set; }

        public int? TotalCount { get; set; }
    }

    public class EmployeeFinancialCustodyExportModel
    {
        [JsonProperty("Employee Code")]
        public int? EmployeeCode { get; set; }

        [JsonProperty("Employee Name")]
        public string EmployeeName { get; set; }

        [JsonProperty("Job Title")]
        public string JobName { get; set; }

        [JsonProperty("Branch")]
        public string BranchName { get; set; }

        [JsonProperty("Financial Custody Type")]
        public string FinancialCustodyType { get; set; }

        [JsonProperty("Execution Date")]
        public string ExecutionDate { get; set; }


        [JsonProperty("Money Amount")]
        public string MoneyAmount { get; set; }

        [JsonProperty("Workflow Status")]
        public string WorkflowStatus { get; set; }

        [JsonProperty("Notes")]
        public string Notes { get; set; }
    }
}
