using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.Sales;
using MasterErp.Service.Finance.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.Sales
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesInvoiceController : ControllerBase
    {
        private readonly ISalesInvoiceService _salesInvoiceService;

        public SalesInvoiceController(ISalesInvoiceService salesInvoiceService)
        {
            _salesInvoiceService = salesInvoiceService;
        }

        [HttpPost]
        [Route("GetSalesInvoicesData")]
        public IActionResult GetSalesInvoicesData(FilterModel model)
        {
            var result= _salesInvoiceService.GetSalesInvoicesData(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewSalesInvoice")]
        public IActionResult CreateNewSalesInvoice(SalesInvoiceModel model)
        {
            var result = _salesInvoiceService.CreateNewSalesInvoice(model);
            return Ok(result);
        }
    }
}
