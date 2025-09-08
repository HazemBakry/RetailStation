using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{

    public class ItemLookupModel : CreatorModel
    {
        public int? ItemLookupId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public int? BranchId { get; set; }
        public int? TotalCount { get; set; }
        public List<ItemLookupDetailsModel> Items { get; set; }
    }
    public class ItemLookupDetailsModel : ItemLookupModel
    {
        public int? ItemLookupDetailsId { get; set; }
        public int ItemId { get; set; }
        public string ItemNameEN { get; set; }
        public string ItemNameAR { get; set; }
        public string UnitNameEN { get; set; }
        public string UnitNameAR { get; set; }
        public int? DisplayOrder { get; set; }
        public double? Quantity { get; set; }
        public double? Price { get; set; }
    }
}
