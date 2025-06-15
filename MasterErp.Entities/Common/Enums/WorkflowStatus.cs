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

    public enum HRWorkflowStatus
    {
        Pending = 11,
        Rejected = 12,
        Approved = 13,
        Completed = 14
    }
    public enum PaymentWorkflowStatus
    {
        Paid = 15,
        UnPaid = 16
    }
    public enum InventoryWorkflowStatus
    {
        Pending = 24,
        Rejected = 25,
        Approved = 26,
        Completed = 27
    }
}
