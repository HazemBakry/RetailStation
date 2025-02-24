using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("CostCenterTree", Schema = "Finance")]

    public class CostCenterTree : CreatorModel
    {
        [Key]
        public int CostCenterId { get; set; }
        public string CostCenterNumber { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int ParentId { get; set; }
        public int? CostLevel { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsParent { get; set; }
        public bool? IsPost { get; set; }
        public int? IsExpences { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
