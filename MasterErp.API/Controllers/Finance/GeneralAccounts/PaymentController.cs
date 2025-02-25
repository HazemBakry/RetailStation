using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;

        }

        [HttpPost]
        [Route("GetPaymentReceipts_Summary")]
        public IActionResult GetPaymentReceiptsSummary(FilterModel model)
        {
            var data = _paymentService.GetPaymentReceipts_Summary(model);
            var result = new PagedResponseModel<ReceiptModel>
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
        public DataTable GetPaymentReceipts_Filters(FilterModel model)
        {
            return _paymentService.GetPaymentReceipts_Filters(model);
        }

        [HttpPost]
        [Route("SavePaymentReceipt")]
        public IActionResult SavePaymentReceipt(PaymentReceipt Model)
        {
            var results = _paymentService.SavePaymentReceipt(Model);
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
        [Route("GetReceiveReceipts_Summary")]
        public IActionResult GetReceiveReceiptsSummary(FilterModel model)
        {
            var data = _paymentService.GetReceiveReceipts_Summary(model);
            var result = new PagedResponseModel<ReceiptModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetReceiveReceipts_Filters")]
        public DataTable GetReceiveReceipts_Filters(FilterModel model)
        {
            return _paymentService.GetReceiveReceipts_Filters(model);
        }

        [HttpPost]
        [Route("SaveReceiveReceipt")]
        public IActionResult SaveReceiveReceipt(ReceiveReceipt Model)
        {
            var results = _paymentService.SaveReceiveReceipt(Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("CancelReceiveReceipt")]
        public IActionResult CancelReceiveReceipt(int ReceiptId)
        {
            var results = _paymentService.CancelReceiveReceipt(ReceiptId);
            return Ok(results);
        }
    }
}
