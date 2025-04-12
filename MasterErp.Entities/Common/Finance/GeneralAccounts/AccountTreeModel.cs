using MasterErp.Entities.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{
    public class AccountTreeModel : CreatorModel
    {
        public int? AccountId { get; set; }
        public int? CostCenterId { get; set; }
        public string AccountNumber { get; set; }

        public int? ParentAccountId { get; set; }
        public int? AccountLevel { get; set; }
        public int? AccountTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        
        public string AssetType { get; set; }
        public string DescriptionMethod { get; set; }

        public double? PreCredit { get; set; }
        public double? PreDebit { get; set; }

        public bool IsSelected { get; set; }
        public bool IsActive { get; set; }
        public bool IsGroup { get; set; }
        public bool IsReadOnly { get; set; }
        public bool IsDisToCostCenter { get; set; }
        public bool IsParent { get; set; }
        public List<AccountTreeModel> Children { get; set; } = new List<AccountTreeModel>();

    }
    public class AccountTreeExportModel
    {
        [JsonProperty("Account Number")]
        public string AccountNumber { get; set; }
        [JsonProperty("Name (AR)")]
        public string NameAR { get; set; }
        [JsonProperty("Name (EN)")]
        public string NameEN { get; set; }

        [JsonProperty("Parent Account Number")]
        public string ParentAccountNumber { get; set; }
        [JsonProperty("Parent Name (AR)")]
        public string ParentNameAR { get; set; }
        [JsonProperty("Parent Account Name (EN)")]
        public string ParentNameEN { get; set; }


        [JsonProperty("Pre Credit")]
        public string PreCredit { get; set; }
        [JsonProperty("Pre Debit")]
        public string PreDebit { get; set; }

    }
}
