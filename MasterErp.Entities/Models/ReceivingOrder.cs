using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class ReceiveOrder
    {
        [Key]
        public int ReceiveOrderId { get; set; }
        public int OrderNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime? ReceiveDate { get; set; }

        public int SupplierId { get; set; }
        public int? InventoryId { get; set; }
        public double TotalValue { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public string Notes { get; set; }

        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }

    }
}
