using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaxCalculationController : ControllerBase
    {
        private readonly ITaxCalculationService _taxCalculationService;
        public TaxCalculationController(ITaxCalculationService taxCalculationService)
        {
            _taxCalculationService = taxCalculationService;
        }

        [HttpPost("GetTaxCalculationData")]
        public DataTable GetTaxCalculationData(FilterModel model)
        {
            var results = _taxCalculationService.GetTaxCalculationData(model);
            return results;
        }

        [HttpGet("GetTaxLookups")]
        public List<TaxLookup> GetTaxLookups()
        {
            var results = _taxCalculationService.GetTaxLookups();
            return results;
        }

        [HttpGet("ChangeTaxCalculationStatus")]
        public ActionsResponseModel ChangeTaxCalculationStatus(int TaxCalculationId, bool IsActive)
        {
            var results = _taxCalculationService.ChangeTaxCalculationStatus(TaxCalculationId, IsActive);
            return results;
        }

        [HttpPost("AddNewTaxCalculation")]
        public ActionsResponseModel AddNewTaxCalculation(TaxCalculation Model)
        {
            var results = _taxCalculationService.AddNewTaxCalculation(Model);
            return results;
        }

        [HttpPost("EditTaxCalculation")]
        public ActionsResponseModel EditTaxCalculation(TaxCalculation Model)
        {
            var results = _taxCalculationService.EditTaxCalculation(Model);
            return results;
        }

        [HttpGet("DeleteTaxCalculation")]
        public ActionsResponseModel DeleteTaxCalculation(int TaxCalculationId)
        {
            var results = _taxCalculationService.DeleteTaxCalculation(TaxCalculationId);
            return results;
        }
    }
}
