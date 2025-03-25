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
        [HttpPost]
        [Route("GetReceiveOrders_Filters")]
        public IActionResult GetReceiveOrders_Filters(SearchFilterModel PagingFilter)
        {
            var result = _inventoryService.GetReceiveOrders_Filters(PagingFilter);

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

        #region Delivery Notes

        [HttpPost]
        [Route("GetDeliveryNotes_Data")]
        public IActionResult GetDeliveryNotes_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetDeliveryNotes_Data(model);
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
        [Route("GetDeliveryNotes_Filters")]
        public IActionResult GetDeliveryNotes_Filters(SearchFilterModel PagingFilter)
        {
            var result = _inventoryService.GetDeliveryNotes_Filters(PagingFilter);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetDeliveryNoteDetailsById")]
        public IActionResult GetDeliveryNoteDetailsById(int OrderId)
        {
            var result = _inventoryService.GetDeliveryNoteDetailsById(OrderId);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetDeliveryNoteProducts_Data")]
        public IActionResult GetDeliveryNoteProducts_Data(int OrderId)
        {
            var result = _inventoryService.GetDeliveryNoteProducts_Data(OrderId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewDeliveryNote")]
        public IActionResult AddNewDeliveryNote(OrderModel model)
        {
            var result = _inventoryService.AddNewDeliveryNote(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditDeliveryNote")]
        public IActionResult EditDeliveryNote(int OrderId, OrderModel model)
        {
            var result = _inventoryService.EditDeliveryNote(OrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelDeliveryNote")]
        public IActionResult CancelDeliveryNote(int OrderId)
        {
            var results = _inventoryService.CancelDeliveryNote(OrderId);
            return Ok(results);
        }

        #endregion

        #region Material Issue

        [HttpPost]
        [Route("GetMaterialIssue_Data")]
        public IActionResult GetMaterialIssues_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetMaterialIssue_Data(model);
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
        [Route("GetMaterialIssue_Filters")]
        public IActionResult GetMaterialIssue_Filters(SearchFilterModel PagingFilter)
        {
            var result = _inventoryService.GetMaterialIssue_Filters(PagingFilter);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetMaterialIssueDetailsById")]
        public IActionResult GetMaterialIssueDetailsById(int OrderId)
        {
            var result = _inventoryService.GetMaterialIssueDetailsById(OrderId);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetMaterialIssueProducts_Data")]
        public IActionResult GetMaterialIssueProducts_Data(int OrderId)
        {
            var result = _inventoryService.GetMaterialIssueProducts_Data(OrderId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewMaterialIssue")]
        public IActionResult AddNewMaterialIssue(OrderModel model)
        {
            model.CreatedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var result = _inventoryService.AddNewMaterialIssue(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditMaterialIssue")]
        public IActionResult EditMaterialIssue(int OrderId, OrderModel model)
        {
            model.ModifiedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var result = _inventoryService.EditMaterialIssue(OrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelMaterialIssue")]
        public IActionResult CancelMaterialIssue(int OrderId)
        {
            var results = _inventoryService.CancelMaterialIssue(OrderId);
            return Ok(results);
        }

        #endregion



        #region Material Requests

        [HttpPost]
        [Route("GetMaterialRequests_Data")]
        public IActionResult GetMaterialRequests_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetMaterialRequests_Data(model);
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
        [Route("CreateNewMaterialRequest")]
        public IActionResult CreateNewMaterialRequest(OrderModel Model)
        {
            Model.CreatedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var results = _inventoryService.CreateNewMaterialRequest(Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("CancelMaterialRequest")]
        public IActionResult CancelMaterialRequest(int OrderId)
        {
            var results = _inventoryService.CancelMaterialRequest(OrderId);
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
