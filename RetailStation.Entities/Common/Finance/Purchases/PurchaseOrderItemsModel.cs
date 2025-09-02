using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.Purchases
{
    public class PurchaseOrderItemsModel
    {
        public int PurchaseOrderId { get; set; }
        public int OrderNumber { get; set; }
        public int SupplierId { get; set; }
        public int PurchaseOrderDetailsId { get; set; }
        public int ItemId { get; set; }
        public int UnitId { get; set; }
        public double Quantity { get; set; }

        public double TotalValue { get; set; }
        public double Price { get; set; }
        public double ItemTotalValue { get; set; }
        public double Cost { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? InsertDate { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsActive { get; set; }

        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public string UnitName { get; set; }

    }
}
