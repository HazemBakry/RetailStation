using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class PurchaseInvoiceModel
    {
        public int? PurchaseInvoiceId { get; set; }
        public int InvoiceNumber { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public int? InvoiceTypeId { get; set; }
        public string InvoiceType { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public double? InvoiceTotalValue { get; set; }
        public string Notes { get; set; }
        public int? UserId { get; set; }
        public List<OrderDetailModel> Items { get; set; }
    }
}
