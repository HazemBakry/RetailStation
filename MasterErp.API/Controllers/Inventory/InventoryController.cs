using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.Inventory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
        
        [HttpGet]
        [Route("GetInventoryList")]
        public IActionResult GetInventoryList()
        {
            var results = _inventoryService.GetInventoryList();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetInventoryStatistics")]
        public IActionResult GetInventoryStatistics()
        {
            var results = _inventoryService.GetInventoryStatistics();
            return Ok(results);
        }

        [HttpPost]
        [Route("GetReceiveOrdersSummary")]
        public IActionResult GetReceiveOrdersSummary(FilterModel model)
        {
            var data = _inventoryService.GetReceiveOrdersSummary(model);

            var result = new PagedResponseModel<OrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveNewReceiveOrder")]
        public IActionResult SaveNewReceiveOrder(OrderModel model)
        {
            var result = _inventoryService.SaveNewReceiveOrder(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("GetDeliveryOrdersSummary")]
        public IActionResult GetDeliveryOrdersSummary(FilterModel model)
        {
            var data = _inventoryService.GetDeliveryOrdersSummary(model);
            var result = new PagedResponseModel<OrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveNewDeliveryOrder")]
        public IActionResult SaveNewDeliveryOrder(OrderModel model)
        {
            var result = _inventoryService.SaveNewDeliveryOrder(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetOrdersSearchData")]
        public IActionResult GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate)
        {
            var result = _inventoryService.GetOrdersSearchData(SupplierId, OrderNumber, OrderDate);
            return Ok(result);
        }
    }
}
