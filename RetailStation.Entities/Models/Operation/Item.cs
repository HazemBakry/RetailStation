using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace RetailStation.Entities.Models.Operation
{
    [Table("Items", Schema = "Inventory")]

    public class Item : CreatorModel
    {
        [Key]
        public int ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Barcode { get; set; }
        public string Code { get; set; }
        public decimal? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public decimal? Cost { get; set; }
        public int? PurchaseUnitId { get; set; }
        public int? UnitId { get; set; }
        public int? ItemCategoryId { get; set; }
        public double? ConvertRatio { get; set; }
        public bool? IsActive { get; set; }
        public int? ItemTypeId { get; set; }

        public ICollection<ItemSupplier> ItemSuppliers { get; set; }
    }
}
