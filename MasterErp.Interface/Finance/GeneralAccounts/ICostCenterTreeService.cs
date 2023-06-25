using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface ICostCenterTreeService
    {
        List<CostCenterTree> GetCostCenterTreeData();
    }
}
