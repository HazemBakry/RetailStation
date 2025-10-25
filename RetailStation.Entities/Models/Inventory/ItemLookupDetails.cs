using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{


    [Table("ItemLookupDetails", Schema = "Inventory")]

    public class ItemLookupDetails
    {
        [Key]
        public int ItemLookupDetailsId { get; set; }
        public int ItemLookupId { get; set; }
        public int ItemId { get; set; }
        public int? DisplayOrder { get; set; }
        public double? Quantity { get; set; }
    }
}
