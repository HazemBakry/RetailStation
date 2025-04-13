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
        List<AccountsTrialBalanceModel> GetAccountsTrialBalanceReport(AccountsReportSearchFilterModel model);
        ActionsResponseModel ExportAccountsTrialBalanceReport(string UserName, AccountsReportSearchFilterModel SearchModel);
        List<AccountsBalanceSheetModel> GetAccountsBalanceSheetReport(AccountsReportSearchFilterModel model);
        ActionsResponseModel ExportAccountsBalanceSheetReport(string UserName, AccountsReportSearchFilterModel SearchModel);


        #region CostCenterReports

        List<CostGeneralLedgerModel> GetCostGeneralLedger(AccountsReportSearchFilterModel SearchModel);
        ActionsResponseModel ExportCostGeneralLedger(string UserName, AccountsReportSearchFilterModel SearchModel);

        List<CostAssistantLedgerModel> GetCostAssistantLedger(AccountsReportSearchFilterModel SearchModel);
        ActionsResponseModel ExportCostAssistantLedger(string UserName, AccountsReportSearchFilterModel SearchModel);
        List<CostTrialBalanceModel> GetCostTrialBalanceReport(AccountsReportSearchFilterModel model);
        ActionsResponseModel ExportCostTrialBalanceReport(string UserName, AccountsReportSearchFilterModel SearchModel);


        #endregion

    }
}
