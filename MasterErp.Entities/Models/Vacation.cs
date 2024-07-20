using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Vacation
    {
		public int VacationId { get; set; }
		public int EmployeeId { get; set; }
		public bool IsAlternativeAvailable { get; set; }
		public int? AlternativeEmployeeId { get; set; }
		public int VacationTypeId { get; set; }
		public DateTime FromDate { get; set; }
		public DateTime ToDate { get; set; }
		public DateTime LastDayWork { get; set; }
		public int? Period { get; set; }

        public int? VacationMonth { get; set; }
		public DateTime? RequestDate { get; set; }
		public DateTime? LastJoinDate { get; set; }
		public string Notes { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
