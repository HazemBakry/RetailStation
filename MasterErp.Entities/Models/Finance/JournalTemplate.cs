using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("JournalTemplates", Schema = "Finance")]
    public class JournalTemplate
    {
        [Key]
        public int JournalTemplateId { get; set; }
        public string DocNumber { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Description { get; set; }
        public int JournalTypeId { get; set; }
        public int? PeriodId { get; set; }
        public int? CurrencyId{ get; set; }
    }
}
