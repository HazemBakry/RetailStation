using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("PaymentTermDetails", Schema = "Finance")]
    public class PaymentTermDetail : CreatorModel
    {
        public int PaymentTermDetailId { get; set; }
        public int PaymentTermId { get; set; }
        public int DuePercentage { get; set; } // النسبة المستحقة
        public int AfterDays { get; set; } // بعد
    }
}
