using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeVacationDto : CreatorModel
    {
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int? EmployeeCode { get; set; }
        public int? EmployeeStatusId { get; set; }
        public int? VacationId { get; set; }
        public int VacationTypeId { get; set; }
        public string VacationType { get; set; }
        public int? AlternativeEmployeeId { get; set; }
        public string AlternativeEmployeeName { get; set; }
        public string AlternativeEmployee { get; set; }
        public string Notes { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime LastDayWork { get; set; }
        public int? Period { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; } = (int)WorkflowStatus.Pending; public bool IsAlternativeAvailable { get; set; }
        public int? TotalCount { get; set; }
        public string BranchName { get; set; }

        public string JobNameEN { get; set; }
        public string JobNameAR { get; set; }
    }


    public class EmployeeVacationExportModel
    {
        [JsonProperty("Employee Code")]
        public int? EmployeeCode { get; set; }

        [JsonProperty("Employee Name")]
        public string EmployeeName { get; set; }

        [JsonProperty("Job Title")]
        public string JobName { get; set; }

        [JsonProperty("Branch")]
        public string BranchName { get; set; }

        [JsonProperty("Vacation Type")]
        public string VacationType { get; set; }

        [JsonProperty("Alternative Employee")]
        public string AlternativeEmployee { get; set; }


        [JsonProperty("From Date")]

        public string FromDate { get; set; }
        [JsonProperty("To Date")]

        public string ToDate { get; set; }
        [JsonProperty("Last Working Date")]

        public string LastDayWork { get; set; }

        [JsonProperty("Period")]
        public int? Period { get; set; }

        [JsonProperty("Workflow Status")]
        public string WorkflowStatus { get; set; }

        [JsonProperty("Notes")]
        public string Notes { get; set; }
    }
}
