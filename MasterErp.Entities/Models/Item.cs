using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Item
    {
		[Key]
		public int ItemID { get; set; }
		public string NameEN { get; set; }
		public string NameAR { get; set; }
		public int UnitID { get; set; }
		public double Price { get; set; }
		public bool? IsActive { get; set; }
		public int? InsertUser { get; set; }
		public DateTime? InsertDate { get; set; }
	}
}
