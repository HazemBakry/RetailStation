using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Lookups
{
    [Table("ReceiptTypes", Schema = "Finance")]
    public class ReceiptType
    {
        [Key]
        public int ReceiptTypeId { get; set; }
        public int? DisplayOrder { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string GroupName { get; set; }
        public bool? IsActive { get; set; }
    }
}
