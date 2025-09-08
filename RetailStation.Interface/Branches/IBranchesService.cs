using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.Lookups;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Branches
{
    public interface IBranchesService
    {
        List<BranchDto> GetBranches(string SubscriberId, SearchFilterModel model);
        BranchDto GetBranchById(string SubscriberId, int BranchId);
        ActionsResponseModel AddNewBranch(string SubscriberId, BranchDto model);
        ActionsResponseModel EditBranch(string SubscriberId, int BranchId, BranchDto model);
        ActionsResponseModel DeleteBranch(string SubscriberId, int BranchId);
    }
}
