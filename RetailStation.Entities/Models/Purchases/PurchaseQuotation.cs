using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Purchases
{
    [Table("PurchaseQuotations", Schema = "Purchase")]

    public class PurchaseQuotation : CreatorModel
    {
        public int PurchaseQuotationId { get; set; }
        public int QuotationNumber { get; set; }
        public string SerialNumber { get; set; }
        public DateTime QuotationDate { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }

    }
}
