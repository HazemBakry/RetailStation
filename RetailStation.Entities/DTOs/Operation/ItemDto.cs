using RetailStation.Entities.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RetailStation.Entities.DTOs.Operation
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
        public decimal? Cost { get; set; }
        public decimal? Price => Cost;
        public decimal? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? ConvertRatio { get; set; }
        public bool? IsActive { get; set; }
        public int? ItemTypeId { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public List<SupplierDto> ItemSuppliers { get; set; }
        public IFormFile Image { get; set; }
        public string ImageUrl { get; set; }

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
        public decimal? Cost { get; set; }

    }


}

