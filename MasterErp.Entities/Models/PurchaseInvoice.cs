using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseInvoice: CreatorModel
    {
		public int PurchaseInvoiceId { get; set; }
		public int InvoiceNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
		public int? InvoiceTypeId { get; set; }
		public DateTime DueDate { get; set; }
		public int SupplierId { get; set; }
		public int? CurrencyId { get; set; }
		public double InvoiceTotalValue { get; set; }
		public double? DiscountAmount { get; set; }
		public double? DiscountPercent { get; set; }
		public double? TaxAmount { get; set; }
		public double? TaxPercent { get; set; }
		public double? InvoiceNetValue { get; set; }
		public int? ReceiveOrderId { get; set; }
		public bool IsLocked { get; set; }
		public bool IsCancelled { get; set; }
		public string Notes { get; set; }
	}
}
