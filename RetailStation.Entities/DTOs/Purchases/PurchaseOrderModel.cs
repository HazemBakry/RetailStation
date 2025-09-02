using RetailStation.Entities.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Purchases
{


    public class PurchaseOrderModel : GeneralOrderModel
    {
        public int? PurchaseOrderId { get; set; }
        public List<int> MaterialRequestIds { get; set; }
        public int SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public int? NextId { get; set; }
        public int? PreviousId { get; set; }
        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? TotalCount { get; set; }

    }
    public class PurchaseOrderDetailsModel : GeneralOrderDetailsModel
    {
        public int? MaterialRequestId { get; set; }


    }
}
