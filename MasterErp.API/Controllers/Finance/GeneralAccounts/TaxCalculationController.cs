using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class TaxCalculationController : ControllerBase
    {
        private readonly ITaxCalculationService _taxCalculationService;
        public TaxCalculationController(ITaxCalculationService taxCalculationService)
        {
            _taxCalculationService = taxCalculationService;
        }


        [HttpPost]
        [Route("GetTaxCalculationsData")]
        public IActionResult GetTaxCalculationsData(SearchFilterModel model)
        {
            var data = _taxCalculationService.GetTaxCalculationsData(model);
            var result = new PagedResponseModel<TaxCalculationModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewTaxCalculation")]
        public IActionResult CreateNewTaxCalculation(TaxCalculationModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _taxCalculationService.CreateNewTaxCalculation(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditTaxCalculation")]
        public IActionResult EditTaxCalculation(int TaxCalculationId, TaxCalculationModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _taxCalculationService.EditTaxCalculation(TaxCalculationId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteTaxCalculation")]
        public IActionResult DeleteTaxCalculation(int TaxCalculationId)
        {
            var results = _taxCalculationService.DeleteTaxCalculation(TaxCalculationId);
            return Ok(results);
        }
        [HttpGet]
        [Route("ChangeTaxCalculationStatus")]
        public IActionResult ChangeTaxCalculationStatus(int TaxCalculationId, bool IsActive)
        {
            var results = _taxCalculationService.ChangeTaxCalculationStatus(TaxCalculationId, IsActive);
            return Ok(results);
        }
    }
}
