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
        List<FinancialPeriodModel> GetFinancialPeriodsData(SearchFilterModel Model);
        ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model);
        ActionsResponseModel EditFinancialPeriod(int FinancialPeriodId, FinancialPeriodModel Model);
        ActionsResponseModel DeleteFinancialPeriod(int FinancialPeriodId);
    }
}
