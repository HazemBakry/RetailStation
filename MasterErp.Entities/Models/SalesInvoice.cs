using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class SalesInvoice
    {
		public int SalesInvoiceId { get; set; }
		public int InvoiceNumber { get; set; }
		public string DocNumber { get; set; }
		public DateTime InvoiceDate { get; set; }
		public int BranchId { get; set; }
		public int? CustomerId { get; set; }
		public double? SubTotal { get; set; }
		public double? Discount { get; set; }
		public double? DiscountPercent { get; set; }
		public double TotalValue { get; set; }
		public double? Tax { get; set; }
		public double? TaxPercent { get; set; }
		public double NetValue { get; set; }
		public bool IsCancelled { get; set; }
		public string Notes { get; set; }
		public string InsertUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public string UpdateUser { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
