using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Finance
{
    [Table("PaymentTerms", Schema = "Finance")]
    public class PaymentTerm : CreatorModel
    {
        public int PaymentTermId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public bool IsActive { get; set; }
    }
}
