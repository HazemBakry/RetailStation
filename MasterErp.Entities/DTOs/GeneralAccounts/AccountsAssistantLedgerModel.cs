using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.GeneralAccounts
{
    public class AccountsAssistantLedgerModel
    {
        public int? AccountId { get; set; }
        public int? EntryNumber { get; set; }
        public DateTime? EntryDate { get; set; }
        public string EntryType { get; set; }
        public string ChequeNumber { get; set; }
        public string Description { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public double? BalanceDebit { get; set; }
        public double? BalanceCredit { get; set; }
        public int? TotalCount { get; set; }
    }
    public class AccountsAssistantLedgerExportModel
    {
        [JsonProperty("Entry Date")]
        public string EntryDate { get; set; }
        [JsonProperty("Entry Type")]
        public string EntryType { get; set; }
        [JsonProperty("Entry Number")]
        public int? EntryNumber { get; set; }

        [JsonProperty("Cheque Number")]
        public string ChequeNumber { get; set; }
        [JsonProperty("Description")]
        public string Description { get; set; }

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
