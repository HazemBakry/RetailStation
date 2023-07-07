using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class CostCenterTreeService: ICostCenterTreeService
    {
        private readonly DBContext Context;

        public CostCenterTreeService(DBContext dBContext)
        {
            Context = dBContext;
        }

        public List<CostCenterTree> GetCostCenterTreeData()
        {
            return Context.CostCenterTrees.ToList();
        }
    }
}
