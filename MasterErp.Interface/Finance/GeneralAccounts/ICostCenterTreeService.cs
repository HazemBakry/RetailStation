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

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface ICostCenterTreeService
    {
        ActionsResponseModel CreateNewCostCenter(CostCenterTreeModel Model);

        ActionsResponseModel UpdateCostCenterTree(int CostCenterId, CostCenterTreeModel Model);
        List<CostCenterTree> GetCostCenterTreeData(bool IsParent);
        List<CostCenterTreeModel> GetCostCenterTreeHierarchicalData(string SearchText);

        ActionsResponseModel ImportCostCenterTreeList(IFormFile File);
        ActionsResponseModel ExportCostCenterTreeList(string SearchText);
    }
}
