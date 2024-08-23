using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
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
        [Route("GetPurchasesOrdersData")]
        public DataTable GetPurchasesOrdersData(FilterModel model)
        {
            return PurchaseOrderService.GetPurchasesOrdersData(model);
        }

        [HttpPost]
        [Route("CreateNewPurchaseOrder")]
        public IActionResult CreateNewPurchaseOrder(PurchaseOrderModel model)
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
