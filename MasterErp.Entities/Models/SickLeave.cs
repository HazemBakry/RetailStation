using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class SickLeave
    {
		public int SickLeaveID { get; set; }
		public int EmployeeID { get; set; }
		public DateTime RequestDate { get; set; }
		public DateTime ExecutionDate { get; set; }
		public int NoDays { get; set; }
		public double MoneyAmount { get; set; }
		public string Notes { get; set; }
		public bool IsActive { get; set; }
		public int? InsertUser { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
