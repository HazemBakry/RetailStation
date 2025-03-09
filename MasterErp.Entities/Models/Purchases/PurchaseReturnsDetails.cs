using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseReturnsDetails", Schema = "Purchase")]

    public class PurchaseReturnsDetails
    {
        public int PurchaseReturnsDetailsId { get; set; }
        public int PurchaseReturnsId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double TotalValue { get; set; }
        public int? UnitId { get; set; }
        public string Notes { get; set; }
        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpireDate { get; set; }

    }
}
