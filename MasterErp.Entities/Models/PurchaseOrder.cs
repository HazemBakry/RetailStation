using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
  
    public class PurchaseOrder
    {
        public int PurchaseOrderID { get; set; }
        public int OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int SupplierID { get; set; }
        public double TotalValue { get; set; }
        public string? Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string? InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }


    }
}
