using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.SystemSettings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.SystemSetting
{
    public interface ISystemSettingService
    {

        #region Regions
        ActionsResponseModel AddRegion(RegionModel model);
        ActionsResponseModel EditRegion(int RegionId, RegionModel model);
        ActionsResponseModel DeleteRegion(int RegionId);
        List<RegionModel> GetRegions_Data(SearchFilterModel model);
        #endregion
        #region Cities
        ActionsResponseModel AddCity(CityModel model);
        ActionsResponseModel EditCity(int CityId, CityModel model);
        ActionsResponseModel DeleteCity(int CityId);
        List<CityModel> GetCities_Data(SearchFilterModel model);
        #endregion
        #region Countries
        ActionsResponseModel AddCountry(CountryModel model);
        ActionsResponseModel EditCountry(int CountryId, CountryModel model);
        ActionsResponseModel DeleteCountry(int CountryId);
        List<CountryModel> GetCountries_Data(SearchFilterModel model);
        #endregion


    }
}
