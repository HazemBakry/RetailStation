using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Purchases;
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
        [Route("GetPurchaseInvoices_Data")]
        public IActionResult GetPurchaseInvoices_Data(SearchFilterModel model)
        {
            var data = _purchaseInvoiceService.GetPurchaseInvoices_Data(model);

            var result = new PagedResponseModel<PurchaseInvoiceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseInvoiceDetailsById")]
        public IActionResult GetPurchaseInvoiceDetailsById(int InvoiceId)
        {
            var result = _purchaseInvoiceService.GetPurchaseInvoiceDetailsById(InvoiceId);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetPurchaseInvoiceProducts_Data")]
        public IActionResult GetPurchaseInvoiceProducts_Data(int InvoiceId)
        {
            var result = _purchaseInvoiceService.GetPurchaseInvoiceProducts_Data(InvoiceId);

            return Ok(result);
        }

        [HttpPost]
        [Route("AddNewPurchaseInvoice")]
        public IActionResult AddNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            var result= _purchaseInvoiceService.AddNewPurchaseInvoice(model);
            return Ok(result);
        }
        [HttpPost]
        [Route("EditPurchaseInvoice")]
        public IActionResult EditPurchaseInvoice(int InvoiceId, PurchaseInvoiceModel model)
        {
            var result = _purchaseInvoiceService.EditPurchaseInvoice(InvoiceId, model);

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




        [HttpPost]
        [Route("GetPurchaseReturns_Data")]
        public IActionResult GetPurchaseReturns_Data(SearchFilterModel model)
        {
            var data = _purchaseInvoiceService.GetPurchaseReturns_Data(model);

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
        [Route("GetPurchaseReturnsDetailsById")]
        public IActionResult GetPurchaseReturnsDetailsById(int OrderId)
        {
            var result = _purchaseInvoiceService.GetPurchaseReturnsDetailsById(OrderId);

            return Ok(result);
        }
        [HttpGet]
        [Route("GetPurchaseReturnsProducts_Data")]
        public IActionResult GetPurchaseReturnsProducts_Data(int OrderId)
        {
            var result = _purchaseInvoiceService.GetPurchaseReturnsProducts_Data(OrderId);

            return Ok(result);

        }

        [HttpPost]
        [Route("AddNewPurchaseReturns")]
        public IActionResult AddNewPurchaseReturns(OrderModel model)
        {
            var result = _purchaseInvoiceService.AddNewPurchaseReturns(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditPurchaseReturns")]
        public IActionResult EditPurchaseReturns(int OrderId, OrderModel model)
        {
            var result = _purchaseInvoiceService.EditPurchaseReturns(OrderId, model);
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
