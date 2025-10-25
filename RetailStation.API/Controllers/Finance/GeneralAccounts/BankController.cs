using RetailStation.Entities.Common;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace RetailStation.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class BankController : ControllerBase
    {
        private readonly IBankService bankService;

        public BankController(IBankService _bankService)
        {
            bankService = _bankService;
        }

        [HttpPost]
        [Route("GetBanksData")]
        public IActionResult GetBanksData(SearchFilterModel model)
        {
            var data = bankService.GetBanksData(model);
            var result = new PagedResponseModel<Bank>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewBank")]
        public IActionResult CreateNewBank(Bank Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = bankService.CreateNewBank(Model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditBank")]
        public IActionResult EditBank(int BankId, Bank Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = bankService.EditBank(BankId, Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteBank")]
        public IActionResult DeleteBank(int BankId)
        {
            var results = bankService.DeleteBank(BankId);
            return Ok(results);
        }

    }
}
