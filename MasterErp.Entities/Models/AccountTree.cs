using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class AccountTree
    {
        public int AccountID { get; set; }
        public string AccountNumber { get; set; }
        public int ParentID { get; set; }
        public int AccountLevel { get; set; }
        public int? AccountTypeID { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string AccountNature { get; set; }
        public string FName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsDisToCostCenter { get; set; }
        public bool? IsPost { get; set; }
        public string AssetType { get; set; }
        public string DepreciationMethod { get; set; }
        public int? DepreciationYears { get; set; }
        public int? DepreciationID { get; set; }
        public int? AccumulatedDepreciationID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifyDate { get; set; }

    }
}
