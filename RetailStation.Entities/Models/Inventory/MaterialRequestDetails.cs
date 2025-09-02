using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Inventory
{

    [Table("MaterialRequestDetails", Schema = "Inventory")]

    public class MaterialRequestDetails
    {
        [Key]
        public int MaterialRequestDetailsId { get; set; }
        public int MaterialRequestId { get; set; }
        public int ItemId { get; set; }
        public int? UnitId { get; set; }
        public double Quantity { get; set; }
        public DateTime? DueDate { get; set; }
        public string Notes { get; set; }
    }
}
