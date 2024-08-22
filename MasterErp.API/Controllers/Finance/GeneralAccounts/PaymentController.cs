using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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
        [Route("GetPaymentReceiptsSummary")]
        public DataTable GetPaymentReceiptsSummary(FilterModel model)
        {
            return _paymentService.GetPaymentReceiptsSummary(model);
        }

        [HttpPost]
        [Route("SaveNewPaymentReceipt")]
        public IActionResult SaveNewPaymentReceipt(PaymentReceipt Model)
        {
            var results = _paymentService.SaveNewPaymentReceipt(Model);
            return Ok(results);
        }


        [HttpPost]
        [Route("GetReceiveReceiptsSummary")]
        public IActionResult GetReceiveReceiptsSummary(FilterModel model)
        {
            var results = _paymentService.GetReceiveReceiptsSummary(model);
            return Ok(results);
        }


        [HttpPost]
        [Route("SaveNewReceiveReceipt")]
        public IActionResult SaveNewReceiveReceipt(ReceiveReceipt Model)
        {
            var results = _paymentService.SaveNewReceiveReceipt(Model);
            return Ok(results);
        }
    }
}
