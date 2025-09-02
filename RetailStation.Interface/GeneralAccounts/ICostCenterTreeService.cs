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
    public interface ICostCenterTreeService
    {
        ActionsResponseModel CreateNewCostCenter(CostCenterTreeModel Model);

        ActionsResponseModel UpdateCostCenterTree(int CostCenterId, CostCenterTreeModel Model);
        string GenerateCostCenterNumber(int? ParentCostCenterId);

        ActionsResponseModel DeleteCostCenterTree(int CostCenterId);
        List<CostCenterTree> GetCostCenterTreeData(bool IsParent);
        List<CostCenterTreeModel> GetCostCenterTreeHierarchicalData(string SearchText);

        ActionsResponseModel ImportCostCenterTreeList(IFormFile File);
        ActionsResponseModel ExportCostCenterTreeList(string SearchText);
    }
}
