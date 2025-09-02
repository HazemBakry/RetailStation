using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.GeneralAccounts
{
    public class MonthlyAssistantLedger
    {
        public DateTime? EntryDate { get; set; }
        public string EntryMonth { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public double? BalanceDebit { get; set; }
        public double? BalanceCredit { get; set; }
        public int? TotalCount { get; set; }
    }

    public class MonthlyAssistantLedgerExportModel
    {
        [JsonProperty("Entry Date")]
        public string EntryDate { get; set; }
        [JsonProperty("Entry Month")]
        public string EntryMonth { get; set; }
        [JsonProperty("Debit")]
        public double? Debit { get; set; }
        [JsonProperty("Credit")]
        public double? Credit { get; set; }
        [JsonProperty("Balance Debit")]
        public double? BalanceDebit { get; set; }
        [JsonProperty("Balance Credit")]
        public double? BalanceCredit { get; set; }
    }

}
