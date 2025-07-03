using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Shared
{
    public interface ILookupService
    {
        #region Global Lookups

        List<SelectorDataModel> GetBanksSelector();
        List<SelectorDataModel> GetIqamaIssuePlacesSelector();
        List<SelectorDataModel> GetCurrencySelector();
        List<SelectorDataModel> GetCitiesSelector(int? CountryId = null);
        List<SelectorDataModel> GetCountriesSelector();

        #endregion

        #region Finance Lookups

        List<SelectorDataModel> GetAccountTypes();
        List<SelectorDataModel> GetActionTypes();
        List<SelectorDataModel> GetBankDepositTypes();
        List<SelectorDataModel> GetJournalEntryTypes();
        List<SelectorDataModel> GetLedgerTypes();
        List<SelectorDataModel> GetPaymentTypes();
        List<SelectorDataModel> GetReceiptTypes(string GroupName);
        List<SelectorDataModel> GetTaxLookups();
        List<SelectorDataModel> GetMaterialRequestPurposes();

        #endregion

        #region HR Lookups

        List<SelectorDataModel> GetWorkStatusSelector(string Group);
        List<SelectorDataModel> GetNationalitiesSelector();
        List<SelectorDataModel> GetReligionsSelector();
        List<SelectorDataModel> GetSocialStatusSelector();
        List<SelectorDataModel> GetVacationTypesSelector();
        List<SelectorDataModel> GetEmployeeStatusSelector();
        List<SelectorDataModel> GetEmployeeDueTypesSelector();
        List<SelectorDataModel> GetSponsorTypesSelector();

        #endregion
    }
}
