using ICU4N.Util;
using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace RetailStation.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentTermController : ControllerBase
    {
        private readonly IPaymentTermService _paymentTermService;
        public PaymentTermController(IPaymentTermService paymentTermService)
        {
            _paymentTermService = paymentTermService;
        }

        [HttpPost("GetPaymentTermsData")]
        public IActionResult GetPaymentTermsData(SearchFilterModel Model)
        {
            var data = _paymentTermService.GetPaymentTermsData(Model);
            var result = new PagedResponseModel<PaymentTermModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
         
        }

        [HttpGet("GetPaymentTermDetailsById")]
        public IActionResult GetPaymentTermDetailsById(int PaymentTermId)
        {
            var result = _paymentTermService.GetPaymentTermDetailsById(PaymentTermId);
            return Ok(result);
        }

        [HttpGet("ChangePaymentTermStatus")]
        public IActionResult ChangePaymentTermStatus(int PaymentTermId,bool IsActive)
        {
            var result = _paymentTermService.ChangePaymentTermStatus(PaymentTermId,IsActive);
            return Ok(result);
        }

        [HttpPost("CreateNewPaymentTerm")]
        public IActionResult CreateNewPaymentTerm(PaymentTermModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var result = _paymentTermService.CreateNewPaymentTerm(Model);
            return Ok(result);
        }

        [HttpPost("CreateNewPaymentTermDetails")]
        public IActionResult CreateNewPaymentTermDetails(int PaymentTermId, PaymentTermDetailsModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var result = _paymentTermService.CreateNewPaymentTermDetails(PaymentTermId,Model);
            return Ok(result);
        }

        [HttpPost("EditPaymentTerm")]
        public IActionResult EditPaymentTerm(int PaymentTermId, PaymentTermModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var result = _paymentTermService.EditPaymentTerm(PaymentTermId,Model);
            return Ok(result);
        }

        [HttpPost("EditPaymentTermDetails")]
        public IActionResult EditPaymentTermDetails(int PaymentTermDetailsId, PaymentTermDetailsModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var result = _paymentTermService.EditPaymentTermDetails(PaymentTermDetailsId,Model);
            return Ok(result);
        }

        [HttpGet("DeletePaymentTerm")]
        public IActionResult DeletePaymentTerm(int PaymentTermId)
        {
            var result = _paymentTermService.DeletePaymentTerm(PaymentTermId);
            return Ok(result);
        }

        [HttpGet("DeletePaymentTermDetails")]
        public IActionResult DeletePaymentTermDetails(int PaymentTermDetailsId)
        {
            var result = _paymentTermService.DeletePaymentTermDetails(PaymentTermDetailsId);
            return Ok(result);
        }
    }
}
