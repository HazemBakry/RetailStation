using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class JournalEntryModel
    {
        public string DocNumber { get; set; }
        public string EntryNumber { get; set; }
        public DateTime EntryDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int JournalTypeID { get; set; }
        public List<JournalEntryAccount> JournalEntryAccounts { get; set; }
    }

    public class JournalEntryAccount
    {
        public int AccountID { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterID { get; set; }
        public double? CostValue { get; set; }
        public double? CostPercent { get; set; }
        public int? CurrencyID { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }
        public string AccountName { get; set; }
        public string Notes { get; set; }
    }

}
