using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class EmployeeContract
    {
		public int EmployeeContractID { get; set; }
		public int EmployeeID { get; set; }
		public int NoYears { get; set; }//
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public int VacationEvery { get; set; }//
		public int VacationDays { get; set; }//

		// Contract Ending
	}
}
