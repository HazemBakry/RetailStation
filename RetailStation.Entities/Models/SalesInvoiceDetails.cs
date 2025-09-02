using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    public class SalesInvoiceDetails
    {
		public int SalesInvoiceDetailsId { get; set; }
		public int SalesInvoiceId { get; set; }
		public int ItemId { get; set; }
		public double Quantity { get; set; }
		public double Price { get; set; }
		public double? SubTotal { get; set; }
		public double? Discount { get; set; }
		public double TotalValue { get; set; }
		public string Notes { get; set; }
	}
}
