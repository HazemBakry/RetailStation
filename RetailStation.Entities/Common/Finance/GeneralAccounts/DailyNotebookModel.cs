using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{

    public class DailyNotebookModel : CreatorModel
    {
        public int? DailyNotebookId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public int LedgerTypeId { get; set; }
        public string Code { get; set; }
        public string VirtualAccount { get; set; }
        public string ReceiptLedgerTypeNameEN { get; set; }
        public string ReceiptLedgerTypeNameAR { get; set; }
        public int? TotalCount { get; set; }

    }
}
