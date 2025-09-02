using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using RetailStation.Interface.Purchase;
using RetailStation.Service.Purchase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService PurchaseOrderService;

        public PurchaseOrderController(IPurchaseOrderService PurchaseOrderService)
        {
            this.PurchaseOrderService = PurchaseOrderService;
        }

        [HttpPost]
        [Route("GetPurchaseOrders_Data")]
        public IActionResult GetPurchaseOrders_Data(SearchFilterModel model)
        {
            var data= PurchaseOrderService.GetPurchaseOrders_Data(model);
            var result = new PagedResponseModel<PurchaseOrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage

            };
            return Ok(result);

        }
        [HttpPost]
        [Route("GetPurchaseOrders_Filters")]
        public IActionResult GetPurchaseOrders_Filters(SearchFilterModel PagingFilter)
        {
            var result = PurchaseOrderService.GetPurchaseOrders_Filters(PagingFilter);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetPurchaseOrderProducts_Data")]
        public IActionResult GetPurchaseOrderProducts_Data(int PurchaseOrderId)
        {
            var result = PurchaseOrderService.GetPurchaseOrderProducts_Data(PurchaseOrderId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseOrderDetailsById")]
        public IActionResult GetPurchaseOrderDetailsById(int PurchaseOrderId)
        {
            var result = PurchaseOrderService.GetPurchaseOrderDetailsById(PurchaseOrderId);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddNewPurchaseOrder")]
        public IActionResult AddNewPurchaseOrder(PurchaseOrderModel model)
        {
            var result = PurchaseOrderService.AddNewPurchaseOrder(model);
            return Ok(result);
        }
        [HttpPost]
        [Route("EditPurchaseOrder")]
        public IActionResult EditPurchaseOrder(int PurchaseOrderId, PurchaseOrderModel model)
        {
            var result = PurchaseOrderService.EditPurchaseOrder(PurchaseOrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseOrder")]
        public IActionResult CancelPurchaseOrder(int PurchaseOrderId)
        {

            var result = PurchaseOrderService.CancelPurchaseOrder(PurchaseOrderId);
            return Ok(result);
        }


        #region MyRegion

        [HttpPost]
        [Route("GetPurchaseQuotations_Data")]
        public IActionResult GetPurchaseQuotations_Data(SearchFilterModel model)
        {
            var data = PurchaseOrderService.GetPurchaseQuotations_Data(model);

            var result = new PagedResponseModel<PurchaseQuotationModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseQuotationDetailsById")]
        public IActionResult GetPurchaseQuotationDetailsById(int PurchaseQuotationId)
        {
            var result = PurchaseOrderService.GetPurchaseQuotationDetailsById(PurchaseQuotationId);

            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseQuotationProducts_Data")]
        public IActionResult GetPurchaseQuotationProducts_Data(int PurchaseQuotationId)
        {
            var result = PurchaseOrderService.GetPurchaseQuotationProducts_Data(PurchaseQuotationId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewPurchaseQuotation")]
        public IActionResult AddNewPurchaseQuotation(PurchaseQuotationModel model)
        {
            var result = PurchaseOrderService.AddNewPurchaseQuotation(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditPurchaseQuotation")]
        public IActionResult EditPurchaseQuotation(int PurchaseQuotationId, PurchaseQuotationModel model)
        {
            var result = PurchaseOrderService.EditPurchaseQuotation(PurchaseQuotationId, model);
            return Ok(result);
        }
        [HttpGet]
        [Route("DeletePurchaseQuotation")]
        public IActionResult DeletePurchaseQuotation(int PurchaseQuotationId)
        {

            var result = PurchaseOrderService.DeletePurchaseQuotation(PurchaseQuotationId);
            return Ok(result);
        }

        #endregion
    }
}
