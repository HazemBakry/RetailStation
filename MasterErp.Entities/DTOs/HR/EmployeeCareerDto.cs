using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeCareerDto : CreatorModel
    {
        public int? EmployeeCareerId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int JobId { get; set; }
        public string JobName { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public int? WorkFlowStatusId { get; set; }
        public string WorkFlowStatusNameAR { get; set; }
        public string WorkFlowStatusNameEN { get; set; }
        public string Notes { get; set; }
        public DateTime ExecutionDate { get; set; }

        public int? TotalCount { get; set; }



    }



}
