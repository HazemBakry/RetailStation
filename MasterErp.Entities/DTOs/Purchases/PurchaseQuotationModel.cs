using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Purchases
{
    public class PurchaseQuotationModel : CreatorModel
    {
        public int PurchaseQuotationId { get; set; }
        public int QuotationNumber { get; set; }
        public DateTime QuotationDate { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public List<PurchaseQuotationDetailsModel> QuotationDetails { get; set; }
        public int? TotalCount { get; set; }
    }
}
