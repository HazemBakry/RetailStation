using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Enums
{
    public enum SearchLevelType
    {
        GroupsAndAccounts = 1,
        GroupsOnly = 2,
        AccountsOnly = 3
    }
    public enum CostCenterType
    {
        Expenses = 1,       //مصروفات
        Withdrawals = 2     //مسحوبات

    }
}
