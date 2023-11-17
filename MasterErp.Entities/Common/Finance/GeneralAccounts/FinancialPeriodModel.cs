using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{
    public class FinancialPeriodModel
    {
        public int? FinancialPeriodId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsLocked { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
    }
}
