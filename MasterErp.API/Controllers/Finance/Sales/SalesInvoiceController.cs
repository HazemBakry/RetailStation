using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.Sales;
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

        [HttpGet]
        [Route("GetSalesInvoiceData")]
        public List<SalesInvoice> GetSalesInvoiceData()
        {
            return _salesInvoiceService.GetSalesInvoiceData();
        }

        [HttpPost]
        [Route("SaveNewSalesInvoice")]
        public (bool HasError, int InvoiceNumber) SaveNewSalesInvoice(SalesInvoiceModel model)
        {
            return _salesInvoiceService.SaveNewSalesInvoice(model);
        }
    }
}
