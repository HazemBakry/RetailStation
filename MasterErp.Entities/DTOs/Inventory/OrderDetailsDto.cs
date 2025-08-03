using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Entities.Models.Purchases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{
    public class OrderDetailsDto
    {
        public int? ItemId { get; set; }
        public string Code { get; set; }
        public string Barcode { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public string CategoryNameAR { get; set; }
        public string CategoryNameEN { get; set; }
        public int? OrderNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public double? Price { get; set; }
        public double? Quantity { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public int? TotalCount { get; set; }

    }
}
