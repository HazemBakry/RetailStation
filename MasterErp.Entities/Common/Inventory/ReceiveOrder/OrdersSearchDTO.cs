using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Inventory.ReceiveOrder
{
    public class OrdersSearchDTO
    {

        public int PurchaseOrderId { get; set; }
        public int OrderNumber { get; set; }
        public int SupplierId { get; set; }
        public double TotalValue { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public List<ItemModel> Items { get; set; }


    }
}
