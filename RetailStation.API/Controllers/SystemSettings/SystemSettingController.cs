using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using RetailStation.Interface.Operation;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.SystemSetting;
using RetailStation.Service.Operation;
using RetailStation.Entities.DTOs.SystemSettings;

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class SystemSettingController : Controller
    {
        private readonly ISystemSettingService _systemSettingService;

        public SystemSettingController(ISystemSettingService systemSettingService)
        {
            _systemSettingService = systemSettingService;
        }


        #region Regions

        [HttpPost]
        [Route("GetRegions_Data")]
        public IActionResult GetRegions_Data(SearchFilterModel model)
        {
            var data = _systemSettingService.GetRegions_Data(model);

            var result = new PagedResponseModel<RegionModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("AddRegion")]
        public ActionsResponseModel AddRegion(RegionModel model)
        {
            return _systemSettingService.AddRegion(model);
        }

        [HttpPost]
        [Route("EditRegion")]
        public ActionsResponseModel EditRegion(int RegionId, RegionModel model)
        {
            return _systemSettingService.EditRegion(RegionId, model);
        }

        [HttpGet]
        [Route("DeleteRegion")]
        public ActionsResponseModel DeleteRegion(int RegionId)
        {
            return _systemSettingService.DeleteRegion(RegionId);
        }
        #endregion

        #region Cities

        [HttpPost]
        [Route("GetCities_Data")]
        public IActionResult GetCities_Data(SearchFilterModel model)
        {
            var data = _systemSettingService.GetCities_Data(model);

            var result = new PagedResponseModel<CityModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("AddCity")]
        public ActionsResponseModel AddCity(CityModel model)
        {
            return _systemSettingService.AddCity(model);
        }

        [HttpPost]
        [Route("EditCity")]
        public ActionsResponseModel EditCity(int CityId, CityModel model)
        {
            return _systemSettingService.EditCity(CityId, model);
        }

        [HttpGet]
        [Route("DeleteCity")]
        public ActionsResponseModel DeleteCity(int CityId)
        {
            return _systemSettingService.DeleteCity(CityId);
        }
        #endregion

        #region Countries

        [HttpPost]
        [Route("GetCountries_Data")]
        public IActionResult GetCountries_Data(SearchFilterModel model)
        {
            var data = _systemSettingService.GetCountries_Data(model);

            var result = new PagedResponseModel<CountryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("AddCountry")]
        public ActionsResponseModel AddCountry(CountryModel model)
        {
            return _systemSettingService.AddCountry(model);
        }

        [HttpPost]
        [Route("EditCountry")]
        public ActionsResponseModel EditCountry(int CountryId, CountryModel model)
        {
            return _systemSettingService.EditCountry(CountryId, model);
        }

        [HttpGet]
        [Route("DeleteCountry")]
        public ActionsResponseModel DeleteCountry(int CountryId)
        {
            return _systemSettingService.DeleteCountry(CountryId);
        }
        #endregion

    }
}
