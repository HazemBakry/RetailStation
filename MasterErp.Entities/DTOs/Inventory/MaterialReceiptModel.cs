using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{


    public class MaterialReceiptModel : GeneralOrderModel
    {
        public int? MaterialReceipttId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public int? StoreId { get; set; }
        public string StoreNameAR { get; set; }
        public string StoreNameEN { get; set; }

        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? TotalCount { get; set; }

    }
    public class MaterialReceiptDetailsModel : GeneralOrderDetailsModel
    {
        public int? MaterialRequestId { get; set; }


    }
}
