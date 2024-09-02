using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{

    public class PurchaseReturns : CreatorModel
    {
        public int PurchaseReturnsId { get; set; }
        public int? SupplierReturnsVoucherId { get; set; }
        public int PurchaseInvoiceId { get; set; }
        public double? TotalValue { get; set; }
        public DateTime? ReturnsDate { get; set; }
        public string Notes { get; set; }



    }
}
