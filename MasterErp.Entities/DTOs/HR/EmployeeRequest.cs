using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeRequest
    {
        public int EmployeeId { get; set; }
        public int RequestId { get; set; }
        public string EmployeeName { get; set; }
        public int? BranchId { get; set; }
        public bool? IsApproved { get; set; }
        public int? RequestStatusId { get; set; }
        public DateTime?  RequestDate { get; set; }
        public string Notes { get; set; }
        public int TotalCount { get; set; }

    }
}
