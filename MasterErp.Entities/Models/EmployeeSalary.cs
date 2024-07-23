using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class EmployeeSalary
    {
		public int EmployeeSalaryId { get; set; }
		public int BasicSalary { get; set; }
		public int ExtraSalary { get; set; }
		public int Transportation { get; set; }
		public string Home { get; set; }
		public string Mopile { get; set; }
		public string WorkNature { get; set; }
		public string Food { get; set; }
		public string Other { get; set; }
		public int TotalSalary { get; set; }
	}
}
