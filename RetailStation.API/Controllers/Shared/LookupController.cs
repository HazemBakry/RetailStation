using RetailStation.Entities.Common;
using RetailStation.Interface.Shared;
using RetailStation.Service.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace RetailStation.API.Controllers.Shared
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class LookupController : ControllerBase
    {
        private readonly ILookupService lookupService;
        public LookupController(ILookupService _lookupService)
        {
            lookupService = _lookupService;
        }

        #region Global Lookups

        [HttpGet]
        [Route("GetBanksSelector")]
        public IActionResult GetBanksSelector()
        {
            var results = lookupService.GetBanksSelector();
            return Ok(results);
        }
        [HttpGet]
        [Route("GetIqamaIssuePlacesSelector")]
        public IActionResult GetIqamaIssuePlacesSelector()
        {
            var results = lookupService.GetIqamaIssuePlacesSelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetCurrencySelector")]
        public IActionResult GetCurrencySelector()
        {
            var results = lookupService.GetCurrencySelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetCitiesSelector")]
        public IActionResult GetCitiesSelector(int? CountryId = null)
        {
            var results = lookupService.GetCitiesSelector(CountryId);
            return Ok(results);
        }
        [HttpGet]
        [Route("GetCountriesSelector")]
        public IActionResult GetCountriesSelector()
        {
            var result = lookupService.GetCountriesSelector();
            return Ok(result);
        }
        #endregion

        #region Finance Lookups

        [HttpGet]
        [Route("GetAccountTypes")]
        public IActionResult GetAccountTypes()
        {
            var results = lookupService.GetAccountTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetActionTypes")]
        public IActionResult GetActionTypes()
        {
            var results = lookupService.GetActionTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetBankDepositTypes")]
        public IActionResult GetBankDepositTypes()
        {
            var results = lookupService.GetBankDepositTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetJournalEntryTypes")]
        public IActionResult GetJournalEntryTypes()
        {
            var results = lookupService.GetJournalEntryTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetLedgerTypes")]
        public IActionResult GetLedgerTypes()
        {
            var results = lookupService.GetLedgerTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetPaymentTypes")]
        public IActionResult GetPaymentTypes()
        {
            var results = lookupService.GetPaymentTypes();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetReceiptTypes")]
        public IActionResult GetReceiptTypes(string GroupName, int PaymentTypeId)
        {
            var results = lookupService.GetReceiptTypes(GroupName, PaymentTypeId);
            return Ok(results);
        }
        [HttpGet]
        [Route("GetTaxLookups")]
        public IActionResult GetTaxLookups()
        {

            var results = lookupService.GetTaxLookups();
            return Ok(results);
        }
        [HttpGet]
        [Route("GetMaterialRequestPurposes")]
        public IActionResult GetMaterialRequestPurposes()
        {

            var results = lookupService.GetMaterialRequestPurposes();
            return Ok(results);
        }

        #endregion

        #region HR Lookups

        [HttpGet]
        [Route("GetWorkStatusSelector")]
        public IActionResult GetWorkStatusSelector(string Group)
        {
            var results = lookupService.GetWorkStatusSelector(Group);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetNationalitiesSelector")]
        public IActionResult GetNationalitiesSelector()
        {
            var results = lookupService.GetNationalitiesSelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetReligionsSelector")]
        public IActionResult GetReligionsSelector()
        {
            var results = lookupService.GetReligionsSelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetSocialStatusSelector")]
        public IActionResult GetSocialStatusSelector()
        {
            var results = lookupService.GetSocialStatusSelector();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetVacationTypesSelector")]
        public IActionResult GetVacationTypesSelector()
        {
            var results = lookupService.GetVacationTypesSelector();
            return Ok(results);
        }
        [HttpGet]
        [Route("GetEmployeeStatusSelector")]
        public IActionResult GetEmployeeStatusSelector()
        {
            var results = lookupService.GetEmployeeStatusSelector();
            return Ok(results);
        }
        [HttpGet]
        [Route("GetEmployeeDueTypesSelector")]
        public IActionResult GetEmployeeDueTypesSelector()
        {
            var results = lookupService.GetEmployeeDueTypesSelector();
            return Ok(results);
        }
                
        [HttpGet]
        [Route("GetSponsorTypesSelector")]
        public IActionResult GetSponsorTypesSelector()
        {
            var results = lookupService.GetSponsorTypesSelector();
            return Ok(results);
        }     
        [HttpGet]
        [Route("GetFinancialCustodyTypesSelector")]
        public IActionResult GetFinancialCustodyTypesSelector()
        {
            var results = lookupService.GetFinancialCustodyTypesSelector();
            return Ok(results);
        }


        #endregion
    }
}