using RetailStation.Entities.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Purchases
{

    public class PurchaseInvoiceModel : GeneralOrderModel
    {
        public int? PurchaseInvoiceId { get; set; }
        public List<int> MaterialReceiptIds { get; set; }
        public int? MaterialReceiptId { get; set; }
        public int SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public double? Discount { get; set; }
        public double? DiscountPercent { get; set; }
        public double? Tax { get; set; }
        public double? TaxPercent { get; set; }
        public double? NetValue { get; set; }
        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? TotalCount { get; set; }

    }
}
