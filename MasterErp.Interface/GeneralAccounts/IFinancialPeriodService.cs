using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IFinancialPeriodService
    {
        PagedResponseModel<FinancialPeriod> GetFinancialPeriodsData(FilterModel Model);
        ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model);
    }
}
