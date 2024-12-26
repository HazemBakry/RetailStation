using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("PaymentTerms", Schema = "Finance")]
    public class PaymentTerm: CreatorModel
    {
        public int PaymentTermId { get; set; }
        public string PaymentTermName { get; set; }
        public bool IsActive { get; set; }
    }
}
