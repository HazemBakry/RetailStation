using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Inventory.ReceiveOrder
{
    public class ReceiveOrderModel
    {
        public int OrderNumber { get; set; }
        public int SupplierId { get; set; }
        public int InventoryId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        public double TotalValue { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public string Notes { get; set; }
        public string DocNumber { get; set; }

        public List<OrderProductModel> Items { get; set; }


    }

}
