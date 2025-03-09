using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.GeneralAccounts
{

    public class CostGeneralLedgerModel
    {
        public int? CostCenterId { get; set; }
        public int? ParentCostCenterId { get; set; }
        public string CostCenterNameAR { get; set; }
        public string CostCenterNameEN { get; set; }
        public string CostCenterNumber { get; set; }
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

    public class CostGeneralLedgerExportModel
    {

        [JsonProperty("CostCenter Name (AR)")]
        public string CostCenterNameAR { get; set; }
        [JsonProperty("CostCenter Name (EN)")]
        public string CostCenterNameEN { get; set; }
        [JsonProperty("CostCenter Number")]
        public string CostCenterNumber { get; set; }
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
