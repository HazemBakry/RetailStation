using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentTermController : ControllerBase
    {
        private readonly IPaymentTermService _paymentTermService;
        public PaymentTermController(IPaymentTermService paymentTermService)
        {
            _paymentTermService = paymentTermService;
        }

        [HttpGet("GetPaymentTermsData")]
        public List<PaymentTerm> GetPaymentTermsData()
        {
            var results = _paymentTermService.GetPaymentTermsData();
            return results;
        }

        [HttpGet("GetPaymentTermDetailsById")]
        public List<PaymentTermDetail> GetPaymentTermDetailsById(int PaymentTermId)
        {
            var results = _paymentTermService.GetPaymentTermDetailsById(PaymentTermId);
            return results;
        }

        [HttpGet("ChangePaymentTermStatus")]
        public ActionsResponseModel ChangePaymentTermStatus(bool IsActive, int PaymentTermId)
        {
            var results = _paymentTermService.ChangePaymentTermStatus(IsActive, PaymentTermId);
            return results;
        }

        [HttpPost("AddNewPaymentTerm")]
        public ActionsResponseModel AddNewPaymentTerm(PaymentTerm Model)
        {
            var results = _paymentTermService.AddNewPaymentTerm(Model);
            return results;
        }

        [HttpPost("AddNewPaymentTermDetails")]
        public ActionsResponseModel AddNewPaymentTermDetails(PaymentTermDetail Model)
        {
            var results = _paymentTermService.AddNewPaymentTermDetails(Model);
            return results;
        }

        [HttpPost("EditPaymentTerm")]
        public ActionsResponseModel EditPaymentTerm(PaymentTerm Model)
        {
            var results = _paymentTermService.EditPaymentTerm(Model);
            return results;
        }

        [HttpPost("EditPaymentTermDetails")]
        public ActionsResponseModel EditPaymentTermDetails(PaymentTermDetail Model)
        {
            var results = _paymentTermService.EditPaymentTermDetails(Model);
            return results;
        }

        [HttpGet("DeletePaymentTerm")]
        public ActionsResponseModel DeletePaymentTerm(int PaymentTermId)
        {
            var results = _paymentTermService.DeletePaymentTerm(PaymentTermId);
            return results;
        }

        [HttpGet("DeletePaymentTermDetails")]
        public ActionsResponseModel DeletePaymentTermDetails(int PaymentTermDetailId)
        {
            var results = _paymentTermService.DeletePaymentTermDetails(PaymentTermDetailId);
            return results;
        }
    }
}
