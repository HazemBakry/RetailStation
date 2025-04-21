using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.DTOs.GeneralAccounts;
using System.Linq;

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
        public IActionResult GetFinancialPeriodsData(SearchFilterModel model)
        {
            var data = _financialPeriodService.GetFinancialPeriodsData(model);
            var result = new PagedResponseModel<FinancialPeriodModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewFinancialPeriod")]
        public IActionResult CreateNewFinancialPeriod(FinancialPeriodModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _financialPeriodService.CreateNewFinancialPeriod(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditFinancialPeriod")]
        public IActionResult EditFinancialPeriod(int FinancialPeriodId,FinancialPeriodModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _financialPeriodService.EditFinancialPeriod(FinancialPeriodId,Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteFinancialPeriod")]
        public IActionResult DeleteFinancialPeriod(int FinancialPeriodId)
        {
            var results = _financialPeriodService.DeleteFinancialPeriod(FinancialPeriodId);
            return Ok(results);
        }

    }
}
