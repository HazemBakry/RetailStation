using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Inventory
{
    [Table("ItemLookups", Schema = "Inventory")]

    public class ItemLookups : CreatorModel
    {
        [Key]
        public int ItemLookupId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public int? BranchId { get; set; }
    }
}
