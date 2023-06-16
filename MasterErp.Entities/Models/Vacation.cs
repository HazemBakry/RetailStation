using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Vacation
    {
		public int VacationID { get; set; }
		public int EmployeeID { get; set; }
		public bool? AlternativeAvailable { get; set; }
		public int AlternativeEmployee { get; set; }
		public int VacationTypeID { get; set; }
		public DateTime FromDate { get; set; }
		public DateTime ToDate { get; set; }
		public DateTime LastDayWork { get; set; }
		public int Period { get; set; }
		public int? VacationMonth { get; set; }
		public DateTime? RequestDate { get; set; }
		public DateTime? LastJoinDate { get; set; }
		public string Notes { get; set; }
		public int? InsertUser { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
