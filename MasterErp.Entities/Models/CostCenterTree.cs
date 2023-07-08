using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class CostCenterTree
    {
		[Key]
		public int CostCenterID { get; set; }
		public string CostCenterNumber { get; set; }
		public string NameAR { get; set; }
		public string NameEN { get; set; }
		public int? ParentID { get; set; }
        public int? CostLevel { get; set; }
        public bool? IsActive { get; set; }
		public bool? IsLocked { get; set; }
		public bool? IsParent { get; set; }
		public bool? IsPost { get; set; }
		public int? IsExpences { get; set; }
		public int? Index { get; set; }
		public int? InsertUser { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? InserDate { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
