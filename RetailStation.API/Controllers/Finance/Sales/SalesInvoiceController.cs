using RetailStation.Entities.Common;
using RetailStation.Interface.Sales;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RetailStation.API.Controllers.Finance.Sales
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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
        public IActionResult CreateNewSalesInvoice(OrderModel model)
        {
            var result = _salesInvoiceService.CreateNewSalesInvoice(model);
            return Ok(result);
        }
    }
}
