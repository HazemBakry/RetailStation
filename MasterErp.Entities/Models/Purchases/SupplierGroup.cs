using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("SupplierGroups", Schema = "Purchase")]

    public class SupplierGroup : CreatorModel
    {
        public int SupplierGroupId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Code { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
    }
}
