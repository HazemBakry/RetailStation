using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Inventory
{
    [Table("MaterialIssue", Schema = "Inventory")]
    public class MaterialIssue : CreatorModel
    {
        [Key]
        public int MaterialIssueId { get; set; }
        public int OrderNumber { get; set; }
        public string SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public int BranchId { get; set; }
        public int StoreId { get; set; }
        public double TotalValue { get; set; }
        public int? WorkflowStatusId { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string Notes { get; set; }
    }
}
