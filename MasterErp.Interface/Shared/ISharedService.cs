using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Shared
{
    public interface ISharedService
    {
        List<Customer> GetCustomersData();
        List<ReceiptLedger> GetReceiptLedgersData();
        List<AccountTree> GetAccountsList(bool IsParent);
        List<AccountTree> GetAccountsByTypeId(int TypeId);
        List<ReceitLedgerType> GetReceiptLedgerTypesData();
        List<FinancialPeriod> GetFinancialPeriods();
        List<AccountType> GetAccountTypes();
        ActionsResponseModel DownloadImporterTemplate(ExcelExportStyle ImporterType);

        #region Selectors
        List<SelectorDataModel> GetBranchesSelector();
        List<SelectorDataModel> GetBanksSelector();
        List<SelectorDataModel> GetNationalitiesSelector();
        List<SelectorDataModel> GetIqamaIssuePlacesSelector();
        List<SelectorDataModel> GetIqamaJobsSelector();

        #endregion
    }
}
