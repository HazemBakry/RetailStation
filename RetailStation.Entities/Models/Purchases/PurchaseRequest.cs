using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseRequests", Schema = "Purchase")]

    public class PurchaseRequest : CreatorModel
    {
        public int PurchaseRequestId { get; set; }
        public int RequestNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime RequestDate { get; set; }
        public int? BranchId { get; set; }
        public string Notes { get; set; }
        public bool? IsCancelled { get; set; }
        public bool? IsDelivered { get; set; }
    }
}
