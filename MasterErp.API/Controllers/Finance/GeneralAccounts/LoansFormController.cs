using MasterErp.Entities.Common;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansFormController : ControllerBase
    {
        private readonly ILoansFormService _loansFormService;
        public LoansFormController(ILoansFormService loansFormService)
        {
            _loansFormService = loansFormService;
        }

        [HttpGet("GetLoansData")]
        public List<Loans> GetLoansData()
        {
            var results = _loansFormService.GetLoansData();
            return results;
        }

        [HttpPost("AddNewLoans")]
        public ActionsResponseModel AddNewLoans(Loans Model)
        {
            var results = _loansFormService.AddNewLoans(Model);
            return results;
        }

        [HttpPost("EditLoans")]
        public ActionsResponseModel EditLoans(Loans Model)
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
