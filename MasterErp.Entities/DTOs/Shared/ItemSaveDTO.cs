using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Shared
{
    public class ItemSaveDTO: CreatorModel
    {
        public int ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int? MainUnitId { get; set; }
        public string MainUnitName { get; set; }
        public int? SubUnitId { get; set; }
        public string SubUnitName { get; set; }
        public int? ItemCategoryId { get; set; }
        public string CategoryName { get; set; }
        public double? Cost { get; set; }
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? ConvertRatio { get; set; }
        public bool? IsActive { get; set; }
        public int? ItemType { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public List<ItemSupplier> ItemSuppliers { get; set; }
    }
}

