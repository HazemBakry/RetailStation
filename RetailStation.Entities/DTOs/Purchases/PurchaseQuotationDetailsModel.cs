using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Purchases
{
    public class PurchaseQuotationDetailsModel
    {
        public int? PurchaseQuotationDetailsId { get; set; }
        public int? PurchaseQuotationId { get; set; }
        public int ItemId { get; set; }
        public double Price { get; set; }
        public int? SupplierId { get; set; }

        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public string Notes { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitNameAR { get; set; }
        public string UnitNameEN { get; set; }
    }
}
