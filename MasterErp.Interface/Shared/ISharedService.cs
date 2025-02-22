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
        List<DailyNotebook> GetLeadgerJournalsData();
        List<SelectorDataModel> GetReceiptLedgersSelector();
        List<SelectorDataModel> GetAccountsSelector(bool IsParent);
        List<SelectorDataModel> GetCostCenterSelector(bool IsParent);
        List<AccountTree> GetAccountsByTypeId(int TypeId);
        List<SelectorDataModel> GetJournalEntryTypesSelector();
        List<LedgerType> GetReceiptLedgerTypesData();
        List<FinancialPeriod> GetFinancialPeriods();
        ActionsResponseModel DownloadImporterTemplate(ExcelExportStyle ImporterType);

        #region Selectors
        List<SelectorDataModel> GetBranchesSelector();
        List<SelectorDataModel> GetAccountTypes();
        List<SelectorDataModel> GetBanksSelector();
        List<SelectorDataModel> GetNationalitiesSelector();
        List<SelectorDataModel> GetIqamaIssuePlacesSelector();
        List<SelectorDataModel> GetVisaJobsSelector();
        List<SelectorDataModel> GetCountriesSelector();
        List<SelectorDataModel> GetCitiesSelector();
        List<SelectorDataModel> GetRegionsSelector();
        List<SelectorDataModel> GetSuppliersSelector();
        List<SelectorDataModel> GetSupplierGroupsSelector();
        List<SelectorDataModel> GetPurchaseInvoiceTypesSelector();
        List<SelectorDataModel> GetItemsSelector();
        List<SelectorDataModel> GetItemCategoriesSelector();
        List<SelectorDataModel> GetUnitsSelector();
        List<SelectorDataModel> GetChildAccountsSelector();
        List<SelectorDataModel> GetInventoriesSelector();
        List<SelectorDataModel> GetItemLookupsSelector();
        List<SelectorDataModel> GetCurrencySelector();
        List<SelectorDataModel> GetReligionsSelector();
        List<SelectorDataModel> GetSocialStatusSelector();


        #endregion
    }
}
