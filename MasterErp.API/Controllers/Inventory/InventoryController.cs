using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Inventory;
using MasterErp.Service.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
            _inventoryService = inventoryService;
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

        [HttpGet]
        [Route("GetOrdersSearchData")]
        public IActionResult GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate)
        {
            var result = _inventoryService.GetOrdersSearchData(SupplierId, OrderNumber, OrderDate);
            return Ok(result);
        }

        #region Receive Orders 

        [HttpPost]
        [Route("GetReceiveOrders_Data")]
        public IActionResult GetReceiveOrders_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetReceiveOrders_Data(model);

            var result = new PagedResponseModel<OrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetReceiveOrderDetailsById")]
        public IActionResult GetReceiveOrderDetailsById(int OrderId)
        {
            var result = _inventoryService.GetReceiveOrderDetailsById(OrderId);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetReceiveOrderProducts_Data")]
        public IActionResult GetReceiveOrderProducts_Data(List<int> OrderIds)
        {
            var result = _inventoryService.GetReceiveOrderProducts_Data(OrderIds);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewReceiveOrder")]
        public IActionResult AddNewReceiveOrder(OrderModel model)
        {
            var result = _inventoryService.AddNewReceiveOrder(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditReceiveOrder")]
        public IActionResult EditReceiveOrder(int OrderId, OrderModel model)
        {
            var result = _inventoryService.EditReceiveOrder(OrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelReceiveOrder")]
        public IActionResult CancelReceiveOrder(int OrderId)
        {
            var results = _inventoryService.CancelReceiveOrder(OrderId);
            return Ok(results);
        }

        #endregion

        #region Delivery Orders

        [HttpPost]
        [Route("GetDeliveryOrders_Data")]
        public IActionResult GetDeliveryOrders_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetDeliveryOrders_Data(model);
            var result = new PagedResponseModel<OrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetDeliveryOrderDetailsById")]
        public IActionResult GetDeliveryOrderDetailsById(int OrderId)
        {
            var result = _inventoryService.GetDeliveryOrderDetailsById(OrderId);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetDeliveryOrderProducts_Data")]
        public IActionResult GetDeliveryOrderProducts_Data(int OrderId)
        {
            var result = _inventoryService.GetDeliveryOrderProducts_Data(OrderId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewDeliveryOrder")]
        public IActionResult AddNewDeliveryOrder(OrderModel model)
        {
            var result = _inventoryService.AddNewDeliveryOrder(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditDeliveryOrder")]
        public IActionResult EditDeliveryOrder(int OrderId, OrderModel model)
        {
            var result = _inventoryService.EditDeliveryOrder(OrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelDeliveryOrder")]
        public IActionResult CancelDeliveryOrder(int OrderId)
        {
            var results = _inventoryService.CancelDeliveryOrder(OrderId);
            return Ok(results);
        }

        #endregion

        #region Purchase Requests

        [HttpPost]
        [Route("GetPurchasesRequestsData")]
        public IActionResult GetPurchasesRequestsData(FilterModel model)
        {
            var results = _inventoryService.GetPurchasesRequestsData(model);

            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewPurchasesRequest")]
        public IActionResult CreateNewPurchasesRequest(OrderModel Model)
        {
            var results = _inventoryService.CreateNewPurchasesRequest(Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("CancelPurchaseRequest")]
        public IActionResult CancelPurchaseRequest(int OrderId)
        {
            var results = _inventoryService.CancelPurchaseRequest(OrderId);
            return Ok(results);
        }
        #endregion

        #region Supplier Vouchers

        [HttpPost]
        [Route("GetSupplierVouchers_Data")]
        public IActionResult GetSupplierVouchers_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetSupplierVouchers_Data(model);
            var result = new PagedResponseModel<OrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelSupplierVoucher")]
        public IActionResult CancelSupplierVoucher(int OrderId)
        {
            var results = _inventoryService.CancelSupplierVoucher(OrderId);
            return Ok(results);
        }



        #endregion
    }
}
