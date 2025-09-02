using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("SickLeaves", Schema = "HR")]

    public class SickLeave : CreatorModel
    {
        public int SickLeaveId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public DateTime? RequestDate { get; set; }
        public int? NoDays { get; set; }
        public string Notes { get; set; }
        public int? WorkflowStatusId { get; set; }

    }
}
