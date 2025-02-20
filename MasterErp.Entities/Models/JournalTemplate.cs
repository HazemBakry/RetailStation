using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("JournalTemplates", Schema = "Finance")]
    public class JournalTemplate
    {
        [Key]
        public int JournalTemplateId { get; set; }
        public string DocNumber { get; set; }
        public string NameAR { get; set; }
        public string Notes { get; set; }
        public int JournalTypeID { get; set; }
        public int PeriodID { get; set; }
        public int CurrencyID { get; set; }
    }
}
