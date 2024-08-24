using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseOrderDetails
    {
        public int PurchaseOrderDetailsId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double TotalValue { get; set; }
        public int? UnitId { get; set; }
        public string Notes { get; set; }

    }
}
