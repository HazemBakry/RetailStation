using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalTemplate
    {
        public int JournalTemplateId { get; set; }
        public string DocNumber { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public int JournalTypeID { get; set; }
        public int PeriodID { get; set; }
        public int CurrencyID { get; set; }
    }
}
