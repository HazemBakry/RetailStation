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
        List<AccountsGeneralLedgerModel> GetAccountsGeneralLedger(AccountsReportSearchFilterModel SearchModel);
        ActionsResponseModel ExportAccountsGeneralLedger(string UserName, AccountsReportSearchFilterModel SearchModel);

        List<AccountsAssistantLedgerModel> GetAccountsAssistantLedger(AccountsReportSearchFilterModel SearchModel);
        ActionsResponseModel ExportAccountsAssistantLedger(string UserName, AccountsReportSearchFilterModel SearchModel);
        List<TrialBalanceModel> GetTrialBalanceReport(AccountsReportSearchFilterModel model);
        ActionsResponseModel ExportTrialBalanceReport(string UserName, AccountsReportSearchFilterModel SearchModel);

    }
}
