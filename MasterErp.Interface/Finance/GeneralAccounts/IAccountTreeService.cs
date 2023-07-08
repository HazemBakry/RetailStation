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
        DataTable GetAccountTreeData(string SearchText);
        List<AccountTree> GetAccountsList(bool IsParent);
        List<AccountTree> GetChildAccountsList();
    }
}
