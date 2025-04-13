using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
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
        List<SelectorDataModel> GetAccountsSelector(bool? IsGroup);
        List<SelectorDataModel> GetCostCenterSelector(bool IsParent);
        List<SelectorDataModel> GetAccountsByTypeId(int TypeId);
        List<FinancialPeriod> GetFinancialPeriods();
        FinancialPeriod GetCurrentFinancialPeriod();
        ActionsResponseModel DownloadImporterTemplate(ExcelExportStyle ImporterType);

        #region Selectors
        List<SelectorDataModel> GetBranchesSelector();
        List<SelectorDataModel> GetOrderStatusSelector();
        List<SelectorDataModel> GetStoresSelector();
        List<SelectorDataModel> GetNationalitiesSelector();
        List<SelectorDataModel> GetIqamaIssuePlacesSelector();
        List<SelectorDataModel> GetVisaJobsSelector();
        List<SelectorDataModel> GetCountriesSelector();
        List<SelectorDataModel> GetCitiesSelector();
        List<SelectorDataModel> GetRegionsSelector();
        List<SelectorDataModel> GetSuppliersSelector();
        List<SelectorDataModel> GetCustomersSelector();  
        List<SelectorDataModel> GetSupplierGroupsSelector();
        List<SelectorDataModel> GetPurchaseInvoiceTypesSelector();
        List<SelectorDataModel> GetItemsSelector();
        List<SelectorDataModel> GetItemCategoriesSelector();
        List<SelectorDataModel> GetUnitsSelector();
        List<SelectorDataModel> GetChildAccountsSelector();
        List<SelectorDataModel> GetItemLookupsSelector();
        List<SelectorDataModel> GetReligionsSelector();
        List<SelectorDataModel> GetSocialStatusSelector();


        #endregion
    }
}
