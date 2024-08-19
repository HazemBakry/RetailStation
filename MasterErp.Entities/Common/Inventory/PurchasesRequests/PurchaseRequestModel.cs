using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Inventory.PurchasesRequests
{
    public class PurchaseRequestModel
    {
        public int? PurchaseRequestId { get; set; }
        public int? RequestNumber { get; set; }
        public DateTime? RequestDate { get; set; }
        public int? BranchId { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public List<OrderProductModel> Items { get; set; }
    }
}
