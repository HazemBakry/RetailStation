using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
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
		public bool IsApproved { get; set; }

	}
}
