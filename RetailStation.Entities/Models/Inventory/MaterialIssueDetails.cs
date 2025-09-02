using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Inventory
{


    [Table("MaterialIssueDetails", Schema = "Inventory")]

    public class MaterialIssueDetails
    {
        [Key]
        public int MaterialIssueDetailsId { get; set; }
        public int MaterialIssueId { get; set; }
        public int ItemId { get; set; }
        public int? UnitId { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double TotalValue { get; set; }
        public string Notes { get; set; }
    }
}
