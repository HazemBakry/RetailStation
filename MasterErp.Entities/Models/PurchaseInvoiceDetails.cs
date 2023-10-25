using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseInvoiceDetails
    {
		public int PurchaseInvoiceDetailsId { get; set; }
		public int PurchaseInvoiceId { get; set; }
		public int ItemId { get; set; }		
		public int? UnitId { get; set; }
		public double Quantity { get; set; }
		public double Price { get; set; }
		public double TotalValue { get; set; }
		public double? Discount { get; set; }
		public double? NetValue { get; set; }
		public string Notes { get; set; }
	}
}
