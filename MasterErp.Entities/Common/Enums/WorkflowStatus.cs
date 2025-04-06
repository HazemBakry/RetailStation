using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Enums
{
    public enum FinanceWorkflowStatus
    {
        Pending = 7,
        Cancelled = 8,
        WaitingPayment = 9,
        Paid = 10
    }

}
