using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Inventory
{


    [Table("MaterialRequests", Schema = "Inventory")]
    public class MaterialRequest : CreatorModel
    {
        [Key]
        public int MaterialRequestId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int OrderNumber { get; set; }
        public string SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int? PurposeId { get; set; }
        public int StoreId { get; set; }
        public int? StatusId { get; set; }
        public double? TotalValue { get; set; }
        public string Notes { get; set; }
        public bool? IsCancelled { get; set; }
        public bool? IsLocked { get; set; }
    }
}
