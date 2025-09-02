using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Purchases
{
    [Table("SupplierReturnsVoucherDetails", Schema = "Purchase")]

    public class SupplierReturnsVoucherDetails
    {
        public int SupplierReturnsVoucherDetailsId { get; set; }
        public int SupplierReturnsVoucherId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double TotalValue { get; set; }
        public double? BalanceBefore { get; set; }

        public int? UnitId { get; set; }
        public string Notes { get; set; }
        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpireDate { get; set; }
    }
}
