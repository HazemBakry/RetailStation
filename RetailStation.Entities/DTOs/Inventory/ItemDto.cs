using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Inventory
{
    public class ItemDto : CreatorModel
    {
        public int? ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitName { get; set; }
        public int? PurchaseUnitId { get; set; }
        public string PurchaseUnitName { get; set; }
        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public double? Cost { get; set; }
        public double? Price => Cost;
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? ConvertRatio { get; set; }
        public bool? IsActive { get; set; }
        public int? ItemTypeId { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public List<int> SupplierIds { get; set; }=new List<int>();
        public List<SupplierDto> ItemSuppliers { get; set; }

        public int? TotalCount { get; set; }

    }

    public class ItemDtoExportModel
    {
        [JsonProperty("Name (AR)")]
        public string NameAR { get; set; }
        [JsonProperty("Name (EN)")]
        public string NameEN { get; set; }
        [JsonProperty("Unit")]
        public string UnitName { get; set; }
        [JsonProperty("Purchase Unit")]
        public string PurchaseUnitName { get; set; }
        [JsonProperty("Category")] 
        public string ItemCategoryName { get; set; }
        [JsonProperty("Cost")]
        public double? Cost { get; set; }

    }


}

