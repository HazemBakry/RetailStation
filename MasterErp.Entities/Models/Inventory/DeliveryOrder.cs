using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Inventory
{
    public class DeliveryOrder : CreatorModel
    {
        [Key]
        public int DeliveryOrderId { get; set; }
        public int OrderNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int BranchId { get; set; }
        public int StoreId { get; set; }
        public double TotalValue { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string Notes { get; set; }
    }
}
