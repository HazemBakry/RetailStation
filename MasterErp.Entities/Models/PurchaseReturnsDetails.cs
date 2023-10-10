using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseReturnsDetails
    {
        public int PurchaseReturnsDetailsID { get; set; }
        public int PurchaseReturnsID { get; set; }
        public int ItemID { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double TotalValue { get; set; }
        public int UnitID { get; set; }
        public string? Notes { get; set; }

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpireDate { get; set; }

    }
}
