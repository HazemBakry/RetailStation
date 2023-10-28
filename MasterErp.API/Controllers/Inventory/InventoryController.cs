using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Interface.Inventory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MasterErp.API.Controllers.Inventory
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService= inventoryService;
        }
        [HttpPost]
        [Route("GetReceiveOrdersSummary")]
        public IActionResult GetReceiveOrdersSummary(FilterModel model)
        {
            var results = _inventoryService.GetReceiveOrdersSummary(model);
            return Ok(results); 
        }

        [HttpGet]
        [Route("GetInventoryList")]
        public IActionResult GetInventoryList()
        {
            var results = _inventoryService.GetInventoryList();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetOrdersSearchData")]
        public IActionResult GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate)
        {

            var result = _inventoryService.GetOrdersSearchData(SupplierId, OrderNumber, OrderDate);
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveNewReceiveOrder")]
        public IActionResult SaveNewReceiveOrder(ReceiveOrderModel model)
        {
            var result = _inventoryService.SaveNewReceiveOrder(model);
            return Ok(result);
        }

    }
}
