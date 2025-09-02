using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseRequestDetails", Schema = "Purchase")]

    public class PurchaseRequestDetails
    {
        public int PurchaseRequestDetailsId { get; set; }
        public int PurchaseRequestId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double? BalanceBefore { get; set; }
        public double? InStock { get; set; }
        public int? UnitId { get; set; }
        public string Notes { get; set; }

    }
}
