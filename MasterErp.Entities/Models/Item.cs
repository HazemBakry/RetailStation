using System;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace MasterErp.Entities.Models
{
    public class Item : CreatorModel
    {
        [Key]
        public int ItemId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double Cost { get; set; }
        public int? SubUnitId { get; set; }
        public int MainUnitId { get; set; }
        public int ItemCategoryId { get; set; }
        public double? ConvertRatio { get; set; }
        public bool IsActive { get; set; }
        public int? ItemType { get; set; }
    }
}
