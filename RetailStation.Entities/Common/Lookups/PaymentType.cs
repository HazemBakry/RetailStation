using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Lookups
{
    [Table("PaymentTypes", Schema = "Finance")]
    public class PaymentType
    {
        [Key]
        public int PaymentTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool? IsActive { get; set; }
    }
}
