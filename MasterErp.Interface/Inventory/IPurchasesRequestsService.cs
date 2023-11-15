using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IPurchasesRequestsService
    {
        PagedResponseDTO<PurchasesRequestDTO> GetPurchasesRequestsData(FilterModel model);
        CreateModifyReturnsModel CreateNewPurchasesRequest(PurchaseRequestModel model);

    }
}
