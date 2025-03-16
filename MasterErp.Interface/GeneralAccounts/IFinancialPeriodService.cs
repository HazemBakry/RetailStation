using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models.Finance;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IFinancialPeriodService
    {
        PagedResponseModel<FinancialPeriod> GetFinancialPeriodsData(FilterModel Model);
        ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model);
    }
}
