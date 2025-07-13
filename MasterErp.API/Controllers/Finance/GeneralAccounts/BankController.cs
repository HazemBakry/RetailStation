using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.GeneralAccounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
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
