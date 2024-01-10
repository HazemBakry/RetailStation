using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{
    public class AccountOpeningBalanceModel
    {
        public int? Id { get; set; }
        public int AccountId { get; set; }
        public string AccountNumber { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }

        public double? Debit { get; set; }
        public double? Credit { get; set; }

    }
}
