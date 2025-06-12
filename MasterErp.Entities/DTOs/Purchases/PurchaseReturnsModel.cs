using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Purchases
{
    public class PurchaseReturnsModel : CreatorModel
    {
        public int? PurchaseReturnsId { get; set; }
        public string SerialNumber { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        public int? SupplierReturnsVoucherId { get; set; }
        public double? TotalValue { get; set; }
        public DateTime? ReturnsDate { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameEN { get; set; }
        public string SupplierNameAR { get; set; }
        public string Notes { get; set; }
        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? TotalCount { get; set; }



    }
}
