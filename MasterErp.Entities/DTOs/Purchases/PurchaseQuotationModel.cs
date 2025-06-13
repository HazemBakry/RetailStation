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
        public int? PurchaseQuotationId { get; set; }
        public int? QuotationNumber { get; set; }
        public DateTime? QuotationDate { get; set; }
        public string Notes { get; set; }
        public string SerialNumber { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public List<PurchaseQuotationDetailsModel> QuotationProducts { get; set; }
        public int? TotalCount { get; set; }


        public int? PurchaseQuotationDetailsId { get; set; }
        public int ItemId { get; set; }
        public double Price { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitNameAR { get; set; }
        public string UnitNameEN { get; set; }
    }
}
