using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{
    public class ItemDto : CreatorModel
    {
        public int? ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public int? PurchaseUnitId { get; set; }
        public string PurchaseUnitName { get; set; }
        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public double Cost { get; set; }
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? ConvertRatio { get; set; }
        public bool IsActive { get; set; }
        public int? ItemType { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public List<int> SupplierIds { get; set; }=new List<int>();
        public List<SupplierDto> ItemSuppliers { get; set; }

        public int? TotalCount { get; set; }

    }
}

