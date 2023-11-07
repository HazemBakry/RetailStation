using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IGeneralAccountsReportService
    {
        DataTable GetAccountsGeneralLedger(SearchFilterModel model);
        DataTable GetAccountsAssistantLedger(SearchFilterModel model);
        DataTable GetTrialBalanceReport(SearchFilterModel model);
    }
}
