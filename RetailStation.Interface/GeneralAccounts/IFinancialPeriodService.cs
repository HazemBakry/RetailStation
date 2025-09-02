using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Models.Finance;

namespace RetailStation.Interface.GeneralAccounts
{
    public interface IFinancialPeriodService
    {
        List<FinancialPeriodModel> GetFinancialPeriodsData(SearchFilterModel Model);
        ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model);
        ActionsResponseModel EditFinancialPeriod(int FinancialPeriodId, FinancialPeriodModel Model);
        ActionsResponseModel DeleteFinancialPeriod(int FinancialPeriodId);
    }
}
