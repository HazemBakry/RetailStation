using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class SalesInvoice
    {
		public int SalesInvoiceID { get; set; }
		public int InvoiceNumber { get; set; }
		public DateTime InvoiceDate { get; set; }
		public int BranchID { get; set; }
		public int? CustomerID { get; set; }
		public double? SubTotal { get; set; }
		public double? Discount { get; set; }
		public double? DiscountPercent { get; set; }
		public double? Tax { get; set; }
		public double? TaxPercent { get; set; }
		public double TotalValue { get; set; }
		public string Driver { get; set; }
		public string Notes { get; set; }
		public bool IsCancelled { get; set; }
		public int? InsertUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
