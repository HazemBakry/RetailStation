using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Finance.GeneralAccounts
{
    public class JournalEntryTypeModel
    {
        public int? JournalTypeId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
    }
}
