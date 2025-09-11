using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    public class SupplierItem : CreatorModel
    {
        public int SupplierItemId { get; set; }
        public int SupplierId { get; set; }
        public string Barcode { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public decimal Price { get; set; }
        public int? ItemId { get; set; }
        public int? UnitId { get; set; }
        public int? ItemCategoryId { get; set; }
        public int? ItemTypeId { get; set; }
        public bool IsActive { get; set; }
        
    }

}
