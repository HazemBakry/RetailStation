using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.PurchasesRequests;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Inventory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterErp.API.Controllers.Inventory
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchasesRequestsController : ControllerBase
    {
        private readonly IPurchasesRequestsService _PuchasesRequestsService;
        public PurchasesRequestsController(IPurchasesRequestsService PuchasesRequestsService)
        {
            _PuchasesRequestsService= PuchasesRequestsService;
        }

        [HttpPost]
        [Route("GetPurchasesRequestsData")]
        public IActionResult GetPurchasesRequestsData(FilterModel model)
        {
            var results = _PuchasesRequestsService.GetPurchasesRequestsData(model);

            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewPurchasesRequest")]
        public IActionResult CreateNewPurchasesRequest(PurchaseRequestModel Model)
        {
            var results = _PuchasesRequestsService.CreateNewPurchasesRequest(Model);
            return Ok(results);
        }
    }


   
}
