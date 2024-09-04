using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Purchase;
using MasterErp.Service.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
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
        [Route("GetPurchaseOrderProducts_Data")]
        public IActionResult GetPurchaseOrderProducts_Data(int OrderId)
        {
            var result = PurchaseOrderService.GetPurchaseOrderProducts_Data(OrderId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseOrderDetailsById")]
        public IActionResult GetPurchaseOrderDetailsById(int OrderId)
        {
            var result = PurchaseOrderService.GetPurchaseOrderDetailsById(OrderId);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddNewPurchaseOrder")]
        public IActionResult AddNewPurchaseOrder(OrderModel model)
        {
            var result = PurchaseOrderService.AddNewPurchaseOrder(model);
            return Ok(result);
        }
        [HttpPost]
        [Route("EditPurchaseOrder")]
        public IActionResult EditPurchaseOrder(int OrderId,OrderModel model)
        {
            var result = PurchaseOrderService.EditPurchaseOrder(OrderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseOrder")]
        public IActionResult CancelPurchaseOrder(int OrderId)
        {

            var result = PurchaseOrderService.CancelPurchaseOrder(OrderId);
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


        #endregion
    }
}
