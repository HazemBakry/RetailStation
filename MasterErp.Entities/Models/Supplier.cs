using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Supplier
    {
		[Key]
		public int SupplierID { get; set; }
		public string Code { get; set; }
		public string NameAR { get; set; }
		public string NameEN { get; set; }
		public string Phone { get; set; }
		public string Mobile { get; set; }
		public string Address { get; set; }
		public double? BeginningBalance { get; set; }
		public string BalanceType { get; set; }
		public int? GroupID { get; set; }
		public string ContactPerson { get; set; }
		public string ContactMobile { get; set; }
		public string Notes { get; set; }
		public bool? IsActive { get; set; }
		public int? InsertUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
