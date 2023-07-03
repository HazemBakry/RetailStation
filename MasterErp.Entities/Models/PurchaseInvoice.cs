using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseInvoice
    {
		public int PurchaseInvoiceID { get; set; }
		public string InvoiceNumber { get; set; }
		public DateTime InvoiceDate { get; set; }
		public int? InvoiceTypeID { get; set; }
		public DateTime DueDate { get; set; }
		public int SupplierID { get; set; }
		public int? CurrencyID { get; set; }
		public double InvoiceTotalValue { get; set; }
		public double? DiscountAmount { get; set; }
		public double? DiscountPercent { get; set; }
		public double? TaxAmount { get; set; }
		public double? TaxPercent { get; set; }
		public double? InvoiceNetValue { get; set; }
		public int? ReceiveOrderID { get; set; }
		public bool IsLocked { get; set; }
		public bool IsCancelled { get; set; }
		public string Notes { get; set; }
		public int? InsertUser { get; set; }
		public DateTime? InsertDate { get; set; }
		public int? UpdateUser { get; set; }
		public DateTime? UpdateDate { get; set; }
	}
}
