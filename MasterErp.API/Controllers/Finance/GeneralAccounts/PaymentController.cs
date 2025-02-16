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
        [Route("GetPaymentReceipts_Summary")]
        public DataTable GetPaymentReceiptsSummary(FilterModel model)
        {
            return _paymentService.GetPaymentReceipts_Summary(model);
        }

        [HttpPost]
        [Route("GetPaymentReceipts_Filters")]
        public DataTable GetPaymentReceipts_Filters(FilterModel model)
        {
            return _paymentService.GetPaymentReceipts_Summary(model);
        }

        [HttpPost]
        [Route("SavePaymentReceipt")]
        public IActionResult SavePaymentReceipt(PaymentReceipt Model)
        {
            var results = _paymentService.SavePaymentReceipt(Model);
            return Ok(results);
        }


        [HttpPost]
        [Route("GetReceiveReceipts_Summary")]
        public IActionResult GetReceiveReceipts_Summary(FilterModel model)
        {
            var results = _paymentService.GetReceiveReceipts_Summary(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("SaveReceiveReceipt")]
        public IActionResult SaveReceiveReceipt(ReceiveReceipt Model)
        {
            var results = _paymentService.SaveReceiveReceipt(Model);
            return Ok(results);
        }
    }
}
