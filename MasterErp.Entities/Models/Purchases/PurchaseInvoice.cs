using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseInvoices", Schema = "Purchase")]

    public class PurchaseInvoice : CreatorModel
    {
        public int PurchaseInvoiceId { get; set; }
        public int InvoiceNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int? InvoiceTypeId { get; set; }
        public DateTime DueDate { get; set; }
        public int SupplierId { get; set; }
        public int? CurrencyId { get; set; }
        public double TotalValue { get; set; }
        public double? Discount { get; set; }
        public double? DiscountPercent { get; set; }
        public double? Tax { get; set; }
        public double? TaxPercent { get; set; }
        public double? NetValue { get; set; }
        public int? ReceiveOrderId { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public string Notes { get; set; }
    }
}
