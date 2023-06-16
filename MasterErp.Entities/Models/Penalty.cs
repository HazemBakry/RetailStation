using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Penalty
    {
		public int PenaltyID { get; set; }
		public int EmployeeID { get; set; }
		public int? PenaltyTypeID { get; set; }
		public DateTime PenaltyDate { get; set; }
		public DateTime ExecutionDate { get; set; }
		public double DeductionByDays { get; set; }
		public double MoneyAmount { get; set; }
		public double DeductionAmount { get; set; }
		public string Reason { get; set; }
		public bool IsActive { get; set; }
		public int? InsertUser { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
