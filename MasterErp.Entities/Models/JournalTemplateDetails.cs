using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalTemplateDetails
    {
        [Key]
        public int TemplateDetailId { get; set; }
        public int JournalTemplateId { get; set; }
        public int AccountId { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterId { get; set; }
        public string Description { get; set; }

    }
}
