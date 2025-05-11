using MasterErp.Entities.Common.Enums;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class JournalEntryModel
    {
        public int? JournalEntryId { get; set; }

        public string DocNumber { get; set; }
        public string EntryNumber { get; set; }
        public DateTime? EntryDate { get; set; }
        public string Description { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int JournalTypeId { get; set; }
        public int? PeriodId { get; set; }
        public int? ActionTypeId { get; set; }
        public int? ActionId { get; set; }
        public List<JournalEntryAccount> JournalEntryAccounts { get; set; }




        public int? EntryMonth { get; set; }
        public string JournalTypeAR { get; set; }
        public string JournalTypeEN { get; set; }
        public string ActionTypeAR { get; set; }
        public string ActionTypeEN { get; set; }
        public string ActionGroup { get; set; }
        public bool? IsLocked { get; set; }
        public bool? EntryStatus { get; set; }
        public bool? IsPosted { get; set; }
        public bool? IsCancelled { get; set; }
        public bool? PostStatus { get; set; }
        public double? TotalCredit { get; set; }
        public double? TotalDebit { get; set; }
        public int? TotalCount { get; set; }
    }




    public class JournalEntryAccount
    {
        public int AccountId { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterId { get; set; }
        public double? CostValue { get; set; }
        public double? CostPercent { get; set; }
        public int? CurrencyId { get; set; }
        public int? SupplierId { get; set; }
        public string AccountNumber { get; set; }
        public string AccountName { get; set; }
        public string CostCenterName { get; set; }
        public string Description { get; set; }
    }

    public class JournalEntryExportModel
    {
        [JsonProperty("Entry Number")]
        public string EntryNumber { get; set; }
       
        [JsonProperty("Entry Type")]
        public string EntryType { get; set; }
        [JsonProperty("Status")]
        public string EntryStatus { get; set; }

        [JsonProperty("Action Type")]
        public string ActionType { get; set; }
        [JsonProperty("Entry Month")]
        public int? EntryMonth { get; set; }
        [JsonProperty("Entry Date")]
        public string EntryDate { get; set; }

        [JsonProperty("Total Debit")]
        public double? TotalDebit { get; set; }
        [JsonProperty("Total Credit")]
        public double? TotalCredit { get; set; }
        
        [JsonProperty("Description")]
        public string Description { get; set; }
       
    }

}
