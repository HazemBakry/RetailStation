using RetailStation.Entities.Common.Enums;
using RetailStation.Interface.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace RetailStation.API.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class SharedController : ControllerBase
    {
        private readonly ISharedService _sharedService;
        public SharedController(ISharedService sharedService)
        {
            _sharedService = sharedService;

        }
        [HttpGet]
        [Route("GetCustomersData")]
        public IActionResult GetCustomersData()
        {
            var results = _sharedService.GetCustomersData();
            return Ok(results);
        }


        [HttpGet]
        [Route("DownloadImporterTemplate")]
        public IActionResult DownloadImporterTemplate(ExcelExportStyle ImporterType)
        {
            var results = _sharedService.DownloadImporterTemplate(ImporterType);

            return Ok(results);
        }


        #region Selectors

        [HttpGet]
        [Route("GetStoresSelector")]
        public IActionResult GetStoresSelector()
        {
            var result = _sharedService.GetStoresSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetSuppliersSelector")]
        public IActionResult GetSuppliersSelector()
        {
            var result = _sharedService.GetSuppliersSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetMerchantsSelector")]
        public IActionResult GetMerchantsSelector()
        {
            var result = _sharedService.GetMerchantsSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetCustomersSelector")]
        public IActionResult GetCustomersSelector()
        {
            var result = _sharedService.GetCustomersSelector();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemsSelector")]
        public IActionResult GetItemsSelector()
        {
            var result = _sharedService.GetItemsSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetCurrentMerchantItemsSelector")]
        public IActionResult GetCurrentMerchantItemsSelector()
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = _sharedService.GetCurrentMerchantItemsSelector(MerchantId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemCategoriesSelector")]
        public IActionResult GetItemCategoriesSelector()
        {
            var result = _sharedService.GetItemCategoriesSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetUnitsSelector")]
        public IActionResult GetUnitsSelector()
        {
            var result = _sharedService.GetUnitsSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetItemLookupsSelector")]
        public IActionResult GetItemLookupsSelector()
        {
            var result = _sharedService.GetItemLookupsSelector();
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetSubscribersSelector")]
        public IActionResult GetSubscribersSelector()
        {
            var result = _sharedService.GetSubscribersSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("GetRegionIdSelector")]
        public IActionResult GetRegionIdSelector(int? CountryId = null, int? CityId = null)
        {
            var results = _sharedService.GetRegionIdSelector(CountryId, CityId);
            return Ok(results);
        }
        [HttpGet]
        [Route("GetCitiesSelector")]
        public IActionResult GetCitiesSelector(int? CountryId = null)
        {
            var results = _sharedService.GetCitiesSelector(CountryId);
            return Ok(results);
        }
        [HttpGet]
        [Route("GetCountriesSelector")]
        public IActionResult GetCountriesSelector()
        {
            var result = _sharedService.GetCountriesSelector();
            return Ok(result);
        }

        #endregion
    }
}
