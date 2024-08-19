using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.Purchases
{
    public class PurchaseOrderModel
    {
        public int? PurchaseInvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public int SupplierId { get; set; }
        public int BranchId { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public List<OrderProductModel> Items { get; set; }
    }
}
