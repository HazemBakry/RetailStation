using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Inventory.ReceiveOrder;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Interface.Inventory;
using RetailStation.Service.Inventory;
using RetailStation.Service.Purchase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace RetailStation.API.Controllers.Inventory
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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
        [Route("GetMaterialReceipts_Data")]
        public IActionResult GetMaterialReceipts_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetMaterialReceipts_Data(model);

            var result = new PagedResponseModel<MaterialReceiptModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetMaterialReceipts_Filters")]
        public IActionResult GetMaterialReceipts_Filters(SearchFilterModel PagingFilter)
        {
            var result = _inventoryService.GetMaterialReceipts_Filters(PagingFilter);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetMaterialReceiptDetailsById")]
        public IActionResult GetMaterialReceiptDetailsById(int MaterialReceiptId)
        {
            var result = _inventoryService.GetMaterialReceiptDetailsById(MaterialReceiptId);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetMaterialReceiptProducts_Data")]
        public IActionResult GetMaterialReceiptProducts_Data(List<int> MaterialReceiptIds)
        {
            var result = _inventoryService.GetMaterialReceiptProducts_Data(MaterialReceiptIds);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewMaterialReceipt")]
        public IActionResult AddNewMaterialReceipt(MaterialReceiptModel model)
        {
            model.CreatedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var result = _inventoryService.AddNewMaterialReceipt(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditMaterialReceipt")]
        public IActionResult EditMaterialReceipt(int MaterialReceiptId, MaterialReceiptModel model)
        {
            model.ModifiedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var result = _inventoryService.EditMaterialReceipt(MaterialReceiptId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelMaterialReceipt")]
        public IActionResult CancelMaterialReceipt(int MaterialReceiptId)
        {
            var results = _inventoryService.CancelMaterialReceipt(MaterialReceiptId);
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
            var result = new PagedResponseModel<MaterialIssueModel>
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
        public IActionResult GetMaterialIssueDetailsById(int MaterialIssueId)
        {
            var result = _inventoryService.GetMaterialIssueDetailsById(MaterialIssueId);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetMaterialIssueProducts_Data")]
        public IActionResult GetMaterialIssueProducts_Data(int MaterialIssueId)
        {
            var result = _inventoryService.GetMaterialIssueProducts_Data(MaterialIssueId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewMaterialIssue")]
        public IActionResult AddNewMaterialIssue(MaterialIssueModel model)
        {
            model.CreatedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var result = _inventoryService.AddNewMaterialIssue(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditMaterialIssue")]
        public IActionResult EditMaterialIssue(int MaterialIssueId, MaterialIssueModel model)
        {
            model.ModifiedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var result = _inventoryService.EditMaterialIssue(MaterialIssueId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelMaterialIssue")]
        public IActionResult CancelMaterialIssue(int MaterialIssueId)
        {
            var results = _inventoryService.CancelMaterialIssue(MaterialIssueId);
            return Ok(results);
        }

        #endregion



        #region Material Requests

        [HttpPost]
        [Route("GetMaterialRequests_Data")]
        public IActionResult GetMaterialRequests_Data(SearchFilterModel model)
        {
            var data = _inventoryService.GetMaterialRequests_Data(model);
            var result = new PagedResponseModel<MaterialRequestModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetMaterialRequests_Filters")]
        public IActionResult GetMaterialRequests_Filters(SearchFilterModel PagingFilter)
        {
            var result = _inventoryService.GetMaterialRequests_Filters(PagingFilter);

            return Ok(result);
        }
        [HttpGet]
        [Route("GetMaterialRequestDetailsById")]
        public IActionResult GetMaterialRequestDetailsById(int MaterialRequestId)
        {
            var result = _inventoryService.GetMaterialRequestDetailsById(MaterialRequestId);

            return Ok(result);
        }


        [HttpPost]
        [Route("CreateNewMaterialRequest")]
        public IActionResult CreateNewMaterialRequest(MaterialRequestModel Model)
        {
            Model.CreatedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var results = _inventoryService.CreateNewMaterialRequest(Model);
            return Ok(results);
        }
        

        [HttpPost]
        [Route("EditMaterialRequest")]
        public IActionResult EditMaterialRequest(int MaterialRequestId,MaterialRequestModel Model)
        {
            Model.ModifiedBy = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var results = _inventoryService.EditMaterialRequest(MaterialRequestId, Model);
            return Ok(results);
        }


        [HttpPost]
        [Route("GetMaterialRequestProducts_Data")]
        public IActionResult GetMaterialRequestProducts_Data(List<int> MaterialRequestIds)
        {
            var result = _inventoryService.GetMaterialRequestProducts_Data(MaterialRequestIds);

            return Ok(result);

        }


        [HttpGet]
        [Route("CancelMaterialRequest")]
        public IActionResult CancelMaterialRequest(int MaterialRequestId)
        {
            var results = _inventoryService.CancelMaterialRequest(MaterialRequestId);
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
