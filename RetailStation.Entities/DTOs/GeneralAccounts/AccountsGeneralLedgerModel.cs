using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.GeneralAccounts
{
    public class AccountsGeneralLedgerModel
    {
        public int? AccountId { get; set; }
        public int? ParentAccountId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
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
    
    public class AccountsGeneralLedgerExportModel
    {

        [JsonProperty("Name (AR)")]
        public string NameAR { get; set; }
        [JsonProperty("Name (EN)")]
        public string NameEN { get; set; }
        [JsonProperty("Account Number")]
        public string AccountNumber { get; set; }
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
        [JsonProperty("Balance Debit")]
        public double? BalanceDebit { get; set; }
        [JsonProperty("Balance Credit")]
        public double? BalanceCredit { get; set; }
    }

}
