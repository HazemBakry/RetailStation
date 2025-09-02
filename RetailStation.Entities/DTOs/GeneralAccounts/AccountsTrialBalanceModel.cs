using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.GeneralAccounts
{
    public class AccountsTrialBalanceModel
    {
        public int? AccountId { get; set; }
        public string AccountNameAR { get; set; }
        public string AccountNameEN { get; set; }
        public string AccountNumber { get; set; }
        public double? PreDebit { get; set; }
        public double? PreCredit { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public double? TotalDebit { get; set; }
        public double? TotalCredit { get; set; }
        public double? BalanceDebit { get; set; }
        public double? BalanceCredit { get; set; }
        public int? TotalCount { get; set; }
    }
    public class AccountsTrialBalanceExportModel
    {
        [JsonProperty("Account Number")]
        public string AccountNumber { get; set; }

        [JsonProperty("Account Name (AR)")]
        public string AccountNameAR { get; set; }
        [JsonProperty("Account Name (EN)")]
        public string AccountNameEN { get; set; }

        [JsonProperty("Pre Debit")]
        public double? PreDebit { get; set; }
        [JsonProperty("Pre Credit")]
        public double? PreCredit { get; set; }
        [JsonProperty("Debit")]
        public double? Debit { get; set; }
        [JsonProperty("Credit")]
        public double? Credit { get; set; }
        [JsonProperty("Total Debit")]
        public double? TotalDebit { get; set; }
        [JsonProperty("Total Credit")]
        public double? TotalCredit { get; set; }

        public double? BalanceDebit { get; set; }
        [JsonProperty("Balance Credit")]
        public double? BalanceCredit { get; set; }


    }
}
