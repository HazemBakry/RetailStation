using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface ICostCenterTreeService
    {
        ActionsResponseModel CreateNewCostCenter(CostCenterTreeModel Model);

        ActionsResponseModel UpdateCostCenterTree(int CostCenterId, CostCenterTreeModel Model);
        ActionsResponseModel DeleteCostCenterTree(int CostCenterId);
        List<CostCenterTree> GetCostCenterTreeData(bool IsParent);
        List<CostCenterTreeModel> GetCostCenterTreeHierarchicalData(string SearchText);

        ActionsResponseModel ImportCostCenterTreeList(IFormFile File);
        ActionsResponseModel ExportCostCenterTreeList(string SearchText);
    }
}
