using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Interface.Website;
using System.Data;
using System.Linq;

namespace RetailStation.API.Controllers.Website
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class PaymentReceiptController : ControllerBase
    {
        private readonly IPaymentReceiptService _paymentService;
        public PaymentReceiptController(IPaymentReceiptService paymentService)
        {
            _paymentService = paymentService;

        }

        //----------------------------------- Payment Receipts ------------------------------------------//


        [HttpPost]
        [Route("GetPaymentReceipts_Data")]
        public IActionResult GetPaymentReceipts_Data(SearchFilterModel model)
        {
            var data = _paymentService.GetPaymentReceipts_Data(model);
            var result = new PagedResponseModel<PaymentReceiptModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetPaymentReceipts_Filters")]
        public IActionResult GetPaymentReceipts_Filters(SearchFilterModel model)
        {
            return Ok(_paymentService.GetPaymentReceipts_Filters(model));
        }

        [HttpGet]
        [Route("GetPaymentReceiptDetailsById")]
        public IActionResult GetPaymentReceiptDetailsById(int PaymentReceiptId)
        {
            var result = _paymentService.GetPaymentReceiptDetailsById(PaymentReceiptId);

            return Ok(result);
        }

        [HttpPost]
        [Route("SaveNewPaymentReceipt")]
        public IActionResult SaveNewPaymentReceipt(PaymentReceiptModel Model)
        {
            var results = _paymentService.SaveNewPaymentReceipt(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditPaymentReceipt")]
        public IActionResult EditPaymentReceipt(int PaymentReceiptId, PaymentReceiptModel Model)
        {
            var results = _paymentService.EditPaymentReceipt(PaymentReceiptId, Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("CancelPaymentReceipt")]
        public IActionResult CancelPaymentReceipt(int ReceiptId)
        {
            var results = _paymentService.CancelPaymentReceipt(ReceiptId);
            return Ok(results);
        }

        [HttpPost]
        [Route("GetSupplierStatementData")]
        public IActionResult GetSupplierStatementData(int SupplierId, SearchFilterModel model)
        {
            var data = _paymentService.GetSupplierStatementData(SupplierId, model);

            var result = new PagedResponseModel<SupplierStatementModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
    }
}
