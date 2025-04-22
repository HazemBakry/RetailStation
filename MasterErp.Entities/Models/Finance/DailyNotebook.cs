using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("DailyNotebooks", Schema = "Finance")]
    public class DailyNotebook : CreatorModel
    {
        public int DailyNotebookId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public int LedgerTypeId { get; set; }
        public string Code { get; set; }
        public string VirtualAccount { get; set; }
    }
}
