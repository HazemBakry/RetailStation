using System;

#nullable disable

namespace MasterErp.Entities.Models
{
    public class RawItem
    {
        public int RawItemId { get; set; }
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public double? PurchasePrice { get; set; }
        public double? Yield { get; set; }
        public double? Cost { get; set; }
        public int? SubUnitId { get; set; }
        public int? MainUnitId { get; set; }
        public int? UnitId { get; set; }
        public int? RawCategoryId { get; set; }
        public int? ConvertRatio { get; set; }
        public bool IsActive { get; set; }
        public int? ItemType { get; set; }
        public string InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
    }
}
