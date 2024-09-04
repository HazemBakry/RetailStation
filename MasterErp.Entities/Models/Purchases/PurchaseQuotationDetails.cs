using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{

    public class PurchaseQuotationDetails
    {
        public int PurchaseQuotationDetailsId { get; set; }
        public int PurchaseQuotationId { get; set; }
        public int ItemId { get; set; }
        public double Price { get; set; }
        public int? SupplierId { get; set; }
        public string Notes { get; set; }

    }
}
