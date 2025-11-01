using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class SupplierItemModel:CreatorModel
    {
        public int? SupplierItemId { get; set; }
        public int? ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitName { get; set; }
        public int? PurchaseUnitId { get; set; }
        public string PurchaseUnitName { get; set; }
        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public decimal? Price { get; set; }
        public decimal? OfferPrice { get; set; }
        public decimal? Price10 { get; set; }
        public decimal? Price100 { get; set; }
        public decimal? Price1000 { get; set; }
        public bool IsActive { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsBestSellerItem { get; set; }
        public int? ItemTypeId { get; set; }
        public int? SupplierId { get; set; }
        public decimal? SupplierRate { get; set; }
        public double? DeliveryTime { get; set; }
        public decimal? DeliveryCost { get; set; }
        public int? PaymentMethodId { get; set; }
        public string SupplierName { get; set; }
        public string PaymentMethod { get; set; }
        public IFormFile Image { get; set; }
        public string ImageUrl { get; set; }

        public int? TotalCount { get; set; }

    }

    public class SupplierItemExportModel
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
        [JsonProperty("Price")]
        public decimal? Price { get; set; }

    }
}
