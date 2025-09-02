using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;

namespace RetailStation.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;

        }

        //----------------------------------- Payment Order ------------------------------------------//

        [HttpPost]
        [Route("GetPaymentOrders_Summary")]
        public IActionResult GetPaymentOrders_Summary(SearchFilterModel model)
        {
            var data = _paymentService.GetPaymentOrders_Summary(model);
            var result = new PagedResponseModel<ReceiptModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPaymentOrderDetailsById")]
        public IActionResult GetPaymentOrderDetailsById(int PaymentOrderId)
        {
            var result = _paymentService.GetPaymentOrderDetailsById(PaymentOrderId);

            return Ok(result);
        }
        [HttpPost]
        [Route("GetPaymentOrders_Filters")]
        public DataTable GetPaymentOrders_Filters(SearchFilterModel model)
        {
            return _paymentService.GetPaymentOrders_Filters(model);
        }

        [HttpPost]
        [Route("SaveNewPaymentOrder")]
        public IActionResult SaveNewPaymentOrder(ReceiptModel Model)
        {
            var results = _paymentService.SaveNewPaymentOrder(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditPaymentOrder")]
        public IActionResult EditPaymentOrder(int PaymentOrderId, ReceiptModel Model)
        {
            var results = _paymentService.EditPaymentOrder(PaymentOrderId,Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("CancelOrderOrder")]
        public IActionResult CancelPaymentOrder(int OrderId)
        {
            var results = _paymentService.CancelPaymentOrder(OrderId);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetPaymentOrderDetails")]
        public IActionResult GetPaymentOrderDetails(int OrderId)
        {
            var results = _paymentService.GetPaymentOrderDetails(OrderId);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetPaymentOrdersSelector")]
        public IActionResult GetPaymentOrdersSelector()
        {
            var results = _paymentService.GetPaymentOrdersSelector();
            return Ok(results);
        }

        //----------------------------------------------------------------------------//

        [HttpPost]
        [Route("GetPaymentReceipts_Summary")]
        public IActionResult GetPaymentReceiptsSummary(SearchFilterModel model)
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
        public DataTable GetPaymentReceipts_Filters(SearchFilterModel model)
        {
            return _paymentService.GetPaymentReceipts_Filters(model);
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
        public IActionResult SaveNewPaymentReceipt(ReceiptModel Model)
        {
            var results = _paymentService.SaveNewPaymentReceipt(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditPaymentReceipt")]
        public IActionResult EditPaymentReceipt(int PaymentReceiptId,ReceiptModel Model)
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
        [Route("GetReceiveReceipts_Summary")]
        public IActionResult GetReceiveReceiptsSummary(SearchFilterModel model)
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
        [Route("SaveNewReceiveReceipt")]
        public IActionResult SaveNewReceiveReceipt(ReceiptModel Model)
        {
            var results = _paymentService.SaveNewReceiveReceipt(Model);
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
