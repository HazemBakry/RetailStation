using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{

    public class PurchaseQuotation : CreatorModel
    {
        public int PurchaseQuotationId { get; set; }
        public int QuotationNumber { get; set; }
        public DateTime QuotationDate { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }

    }
}
