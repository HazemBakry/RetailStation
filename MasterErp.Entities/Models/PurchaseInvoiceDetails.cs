using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseInvoiceDetails
    {
		public int PurchaseInvoiceDetailsID { get; set; }
		public int PurchaseInvoiceID { get; set; }
		public int ItemID { get; set; }
		public double Quantity { get; set; }
		public double Price { get; set; }
		public double TotalValue { get; set; }
		public double? Discount { get; set; }
		public int UnitID { get; set; }
		public double? Tax { get; set; }
		public double? NetValue { get; set; }
		public DateTime? ProductionDate { get; set; }
		public DateTime? ExpireDate { get; set; }
		public string Notes { get; set; }
	}
}
