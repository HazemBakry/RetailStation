using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models.Finance;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts
{
    public interface IAccountTreeService
    {
        ActionsResponseModel AddNewAccount(AccountTreeModel Model);
        string GenerateAccountNumber(int? ParentAccountId);
        ActionsResponseModel EditAccountTree(int AccountId, AccountTreeModel Model);
        ActionsResponseModel DeleteAccountTree(int AccountId);
        List<AccountTreeModel> GetAccountTreeData(string SearchText);
        List<AccountTreeModel> GetAccountTreeHierarchicalData(string SearchText);
        List<AccountTree> GetAccountsList(bool IsParent);
        ActionsResponseModel ImportAccountTreeList(IFormFile File);
        ActionsResponseModel ExportAccountTreeList(string SearchText);

        #region MyRegion
        //ActionsResponseModel CreateNewOpeningBalance(AccountOpeningBalanceModel Model);
        ActionsResponseModel UpdateAccountsOpeningBalance(List<AccountTreeModel> Model);
        List<AccountTreeModel> GetAccountsOpeningBalanceData(string SearchText);

        #endregion
    }
}
