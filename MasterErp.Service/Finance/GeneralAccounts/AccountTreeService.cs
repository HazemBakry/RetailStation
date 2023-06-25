using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class AccountTreeService : IAccountTreeService
    {
        private readonly DBContext Context;

        public AccountTreeService(DBContext dBContext)
        {
            Context = dBContext;
        }

        public List<AccountTree> GetAccountTreeData()
        {
            return Context.AccountTree.ToList();
        }
    }
}
