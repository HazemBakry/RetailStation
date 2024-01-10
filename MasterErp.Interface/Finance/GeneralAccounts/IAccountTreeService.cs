using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IAccountTreeService
    {
        ActionsResponseModel CreateNewAccount(AccountTreeModel Model);
        DataTable GetAccountTreeData_Old(string SearchText);
        List<AccountTreeModel> GetAccountTreeData(string SearchText);
        List<AccountTreeModel> GetAccountTreeHierarchicalData(string SearchText);
        List<AccountTree> GetAccountsList(bool IsParent);
        List<AccountTree> GetChildAccountsList();

        #region MyRegion
        //ActionsResponseModel CreateNewOpeningBalance(AccountOpeningBalanceModel Model);
        ActionsResponseModel UpdateAccountsOpeningBalance(List<AccountTreeModel> Model);
        List<AccountOpeningBalanceModel> GetAccountsOpeningBalanceData(string SearchText);

        #endregion
    }
}
