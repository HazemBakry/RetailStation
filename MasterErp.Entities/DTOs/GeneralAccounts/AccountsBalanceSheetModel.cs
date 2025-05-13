using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.GeneralAccounts
{


    public class AccountsBalanceSheetModel
    {
        public int? AccountId { get; set; }
        public string AccountNameAR { get; set; }
        public string AccountNameEN { get; set; }
        public string AccountNumber { get; set; }
        public double? BalanceDebit { get; set; }
        public double? BalanceCredit { get; set; }
        public bool IsGroup { get; set; }
        public int? TotalCount { get; set; }
    }
    public class AccountsBalanceSheetExportModel
    {
        [JsonProperty("Account Number")]
        public string AccountNumber { get; set; }

        [JsonProperty("Account Name (AR)")]
        public string AccountNameAR { get; set; }
        [JsonProperty("Account Name (EN)")]
        public string AccountNameEN { get; set; }

        public double? BalanceDebit { get; set; }
        [JsonProperty("Balance Credit")]
        public double? BalanceCredit { get; set; }


    }
}
