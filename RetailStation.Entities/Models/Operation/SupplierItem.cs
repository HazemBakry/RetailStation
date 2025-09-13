using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("SupplierItems", Schema = "Supplier")]

    public class SupplierItem : CreatorModel
    {
        public int SupplierItemId { get; set; }
        public int SupplierId { get; set; }
        public string Barcode { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public int? ItemId { get; set; }
        public int? UnitId { get; set; }
        public int? ItemCategoryId { get; set; }
        public int? ItemTypeId { get; set; }
        public bool IsActive { get; set; }
        public string ImageUrl { get; set; }


    }

}
