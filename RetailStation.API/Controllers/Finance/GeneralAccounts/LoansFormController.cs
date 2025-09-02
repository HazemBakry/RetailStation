using RetailStation.Entities.Common;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace RetailStation.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class LoansFormController : ControllerBase
    {
        private readonly ILoansFormService _loansFormService;
        public LoansFormController(ILoansFormService loansFormService)
        {
            _loansFormService = loansFormService;
        }

        [HttpGet("GetLoansData")]
        public List<Loan> GetLoansData()
        {
            var results = _loansFormService.GetLoansData();
            return results;
        }

        [HttpPost("AddNewLoans")]
        public ActionsResponseModel AddNewLoans(Loan Model)
        {
            var results = _loansFormService.AddNewLoans(Model);
            return results;
        }

        [HttpPost("EditLoans")]
        public ActionsResponseModel EditLoans(Loan Model)
        {
            var results = _loansFormService.EditLoans(Model);
            return results;
        }

        [HttpGet("DeleteLoans")]
        public ActionsResponseModel DeleteLoans(int LoanId)
        {
            var results = _loansFormService.DeleteLoans(LoanId);
            return results;
        }
    }
}
