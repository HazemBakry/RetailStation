using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialPeriodController : ControllerBase
    {

        private readonly IFinancialPeriodService _financialPeriodService;

        public FinancialPeriodController(IFinancialPeriodService financialPeriodService)
        {
            _financialPeriodService = financialPeriodService;
        }



        [HttpPost]
        [Route("GetFinancialPeriodsData")]
        public IActionResult GetFinancialPeriodsData(FilterModel model)
        {
            var results = _financialPeriodService.GetFinancialPeriodsData(model);

            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewFinancialPeriod")]
        public IActionResult CreateNewFinancialPeriod(FinancialPeriodModel Model)
        {
            var results = _financialPeriodService.CreateNewFinancialPeriod(Model);
            return Ok(results);
        }

    }
}
