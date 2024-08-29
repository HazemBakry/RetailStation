using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Interface.Purchase;
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

        [HttpPost]
        [Route("CreateNewPurchaseOrder")]
        public IActionResult CreateNewPurchaseOrder(OrderModel model)
        {
            var result = PurchaseOrderService.CreateNewPurchaseOrder(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseOrder")]
        public IActionResult CancelPurchaseOrder(int OrderId)
        {

            var result = PurchaseOrderService.CancelPurchaseOrder(OrderId);
            return Ok(result);
        }
    }
}
