using RetailStation.Entities.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("MerchantItems", Schema = "Operation")]

    public class MerchantItem : CreatorModel
    {
        public int MerchantItemId { get; set; }
        public int MerchantId { get; set; }
        public string Barcode { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public decimal Price { get; set; }
        public decimal? OfferPrice { get; set; }
        public decimal? Price10 { get; set; }
        public decimal? Price100 { get; set; }
        public decimal? Price1000 { get; set; }
        public decimal Quantity { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public int? ItemId { get; set; }
        public int? UnitId { get; set; }
        public int? ItemCategoryId { get; set; }
        public int? ItemTypeId { get; set; }
        public bool IsActive { get; set; }
        public bool IsBestSellerItem { get; set; }
        public string ImageUrl { get; set; }


    }

}
