using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Finance
{
    [Table("PaymentTermDetails", Schema = "Finance")]
    public class PaymentTermDetails : CreatorModel
    {
        public int PaymentTermDetailsId { get; set; }
        public int PaymentTermId { get; set; }
        public int DuePercentage { get; set; } // النسبة المستحقة
        public int DueAfterDays { get; set; } // بعد
    }
}
