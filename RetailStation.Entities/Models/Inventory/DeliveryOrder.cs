using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Inventory
{
    [Table("DeliveryNotes", Schema = "Inventory")]
    public class DeliveryNote : CreatorModel
    {
        [Key]
        public int DeliveryNoteId { get; set; }
        public int OrderNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public int BranchId { get; set; }
        public int StoreId { get; set; }
        public double TotalValue { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string Notes { get; set; }
    }
}
