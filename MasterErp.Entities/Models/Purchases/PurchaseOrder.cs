using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseOrders", Schema = "Purchase")]

    public class PurchaseOrder : CreatorModel
    {
        public int PurchaseOrderId { get; set; }
        public int OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int SupplierId { get; set; }
        public double TotalValue { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }

    }
}
