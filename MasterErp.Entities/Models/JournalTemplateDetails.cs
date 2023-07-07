using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalTemplateDetails
    {
        public int TemplateDetailId { get; set; }
        public int JournalTemplateId { get; set; }
        public int AccountId { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterId { get; set; }
        public string Description { get; set; }

    }
}
