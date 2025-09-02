using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Purchases
{
    public class PurchaseReturnsModel : CreatorModel
    {
        public int? PurchaseReturnsId { get; set; }
        public int? OrderNumber { get; set; }
        public string SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        public int? SupplierReturnsVoucherId { get; set; }
        public double? TotalValue { get; set; }
        public DateTime? ReturnsDate { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameEN { get; set; }
        public string SupplierNameAR { get; set; }
        public string PurchaseInvoiceSerialNumber { get; set; }
        public string Notes { get; set; }
        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? PreviousId { get; set; }
        public int? NextId { get; set; }
        public int? TotalCount { get; set; }



    }
}
