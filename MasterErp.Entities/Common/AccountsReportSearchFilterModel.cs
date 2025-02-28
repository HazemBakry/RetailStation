using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class AccountsReportSearchFilterModel : SearchFilterModel
    {
        public int? AccountId { get; set; }
        public int? CostCenterId { get; set; }
    }
}
