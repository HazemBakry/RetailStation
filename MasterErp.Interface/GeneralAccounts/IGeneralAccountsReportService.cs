using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IGeneralAccountsReportService
    {
        List<AccountsGeneralLedgerModel> GetAccountsGeneralLedger(AccountsReportSearchFilterModel model);
        ActionsResponseModel ExportAccountsGeneralLedger(string UserName, AccountsReportSearchFilterModel model);

        DataTable GetAccountsAssistantLedger(SearchFilterModel model);
        List<JournalEntryViewModel> GetTrialBalanceReport(SearchFilterModel model);
    }
}
