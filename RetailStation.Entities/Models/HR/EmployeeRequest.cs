using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Azure.Core.HttpHeader;

namespace RetailStation.Entities.Models.HR
{
    [Table("EmployeeRequests", Schema = "HR")]

    public class EmployeeRequest: CreatorModel
    {
        public int EmployeeRequestId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime RequestDate { get; set; }
        public int BranchId { get; set; }
        public int RequestTypeId { get; set; }
        public bool? IsApproved { get; set; }
        public int? RequestStatusId { get; set; }
        public string Notes { get; set; }
    }
}
