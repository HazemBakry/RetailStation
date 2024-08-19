using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{

    public class SalesInvoiceModel
    {
        public int? SalesInvoiceId { get; set; }
        public int InvoiceNumber { get; set; }
        public int? SupplierId { get; set; }
        public int? BranchId { get; set; }
        public double TotalValue { get; set; }
        public double TaxPercent { get; set; }
        public double SubTotal { get; set; }
        public double? Discount { get; set; }
        public double? DiscountPercent { get; set; }
        public double NetValue { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string DocNumber { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public string CustomerId { get; set; }
        public List<OrderProductModel> Items { get; set; }
    }
}
