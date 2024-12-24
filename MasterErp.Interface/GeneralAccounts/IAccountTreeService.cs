using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IAccountTreeService
    {
        ActionsResponseModel AddNewAccount(AccountTreeModel Model);
        ActionsResponseModel EditAccountTree(int AccountId, AccountTreeModel Model);
        DataTable GetAccountTreeData_Old(string SearchText);
        List<AccountTreeModel> GetAccountTreeData(string SearchText);
        List<AccountTreeModel> GetAccountTreeHierarchicalData(string SearchText);
        List<AccountTree> GetAccountsList(bool IsParent);
        List<AccountTree> GetChildAccountsList();
        ActionsResponseModel ImportAccountTreeList(IFormFile File);
        ActionsResponseModel ExportAccountTreeList(string SearchText);

        #region MyRegion
        //ActionsResponseModel CreateNewOpeningBalance(AccountOpeningBalanceModel Model);
        ActionsResponseModel UpdateAccountsOpeningBalance(List<AccountTreeModel> Model);
        List<AccountTreeModel> GetAccountsOpeningBalanceData(string SearchText);

        #endregion
    }
}
