using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        [HttpGet]
        [Route("GetPaymentReceiptData")]
        public IActionResult GetPaymentReceiptData()
        {
            var results = _paymentService.GetPaymentReceiptData();
            return Ok(results);
        }

        [HttpPost]
        [Route("SaveNewPaymentReceipt")]
        public IActionResult SaveNewPaymentReceipt(PaymentReceipt Model)
        {
            var results = _paymentService.SaveNewPaymentReceipt(Model);
            return Ok(results);
        }


        [HttpGet]
        [Route("GetReceiveReceiptData")]
        public IActionResult GetReceiveReceiptData()
        {
            var results = _paymentService.GetReceiveReceiptData();
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
