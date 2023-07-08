using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalEntryDetail
    {
        public int JournalEntryDetailID { get; set; }
        public int JournalEntryID { get; set; }
        public int AccountID { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterID { get; set; }
        public double? CostValue { get; set; }
        public double? CostPercent { get; set; }
        public int? CurrencyID { get; set; }
        public string Description { get; set; }
        public int? SupplierID { get; set; }
    }
}
