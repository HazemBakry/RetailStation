using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.DTOs.Lookups;
using RetailStation.Entities.Models.Finance;
using RetailStation.Entities.Models.Subscription;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Shared
{
    public interface ISharedService
    {
        BranchDto GetBranchById(string SubscriberId, int BranchId);
        List<Customer> GetCustomersData();
        ActionsResponseModel DownloadImporterTemplate(ExcelExportStyle ImporterType);

        #region Selectors
        List<SelectorDataModel> GetBranchesSelector();
       
        List<SelectorDataModel> GetStoresSelector();
       
        List<SelectorDataModel> GetSuppliersSelector();
        List<SelectorDataModel> GetCustomersSelector();  
        List<SelectorDataModel> GetItemsSelector();
        List<SelectorDataModel> GetItemCategoriesSelector();
        List<SelectorDataModel> GetUnitsSelector();
        List<SelectorDataModel> GetItemLookupsSelector();
        List<SelectorDataModel_Str> GetSubscribersSelector();

        #endregion
    }
}
