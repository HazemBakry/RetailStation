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
    public class PurchaseInvoiceController : ControllerBase
    {
        private readonly IPurchaseInvoiceService _purchaseInvoiceService;

        public PurchaseInvoiceController(IPurchaseInvoiceService purchaseInvoiceService)
        {
            _purchaseInvoiceService = purchaseInvoiceService;
        }

        [HttpPost]
        [Route("GetPurchaseInvoicesSummary")]
        public DataTable GetPurchaseInvoicesSummary(FilterModel model)
        {
            return _purchaseInvoiceService.GetPurchaseInvoicesSummary(model);
        }

        [HttpPost]
        [Route("CreateNewPurchaseInvoice")]
        public IActionResult CreateNewPurchaseInvoice(OrderModel model)
        {
            var result= _purchaseInvoiceService.CreateNewPurchaseInvoice(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseInvoice")]
        public IActionResult CancelPurchaseInvoice(int InvoiceId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseInvoice(InvoiceId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetInvoicesSearchData")]
        public IActionResult GetInvoicesSearchData(int SupplierId,string InvoiceNumber,string InvoiceDate)
        {

            var result = _purchaseInvoiceService.GetInvoicesSearchData(SupplierId,InvoiceNumber,InvoiceDate);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPurchaseInvoiceDetails")]
        public IActionResult GetPurchaseInvoiceDetails(int InvoiceId)
        {
            var result = _purchaseInvoiceService.GetPurchaseInvoiceDetails(InvoiceId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetSupplierStatementData")]
        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId)
        {
            return _purchaseInvoiceService.GetSupplierStatementData(SupplierId);
        }

        [HttpGet]
        [Route("GetPurchasesReturnsData")]
        public List<PurchaseReturns> GetPurchasesReturnsData()
        {
            return _purchaseInvoiceService.GetPurchasesReturnsData();
        }

        [HttpPost]
        [Route("SaveNewPurchaseReturns")]
        public IActionResult SaveNewPurchaseReturns(OrderModel model)
        {
            var result = _purchaseInvoiceService.SaveNewPurchaseReturns(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseReturns")]
        public IActionResult CancelPurchaseReturns(int ReturnsId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseReturns(ReturnsId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetInvoiceTypesData")]
        public IActionResult GetInvoiceTypesData()
        {
            var results= _purchaseInvoiceService.GetInvoiceTypesData();
            return Ok(results);
        }

    }
}
